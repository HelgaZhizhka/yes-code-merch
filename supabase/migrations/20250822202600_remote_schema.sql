

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."clear_default_address"("_address_type" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  u uuid := auth.uid();
begin
  if _address_type = 'shipping' then
    update public.addresses
      set is_default_shipping = false
      where user_id = u and is_default_shipping;
  elsif _address_type = 'billing' then
    update public.addresses
      set is_default_billing = false
      where user_id = u and is_default_billing;
  else
    raise exception 'address_type must be ''shipping'' or ''billing''';
  end if;
end;
$$;


ALTER FUNCTION "public"."clear_default_address"("_address_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."complete_registration"("_title" "text", "_first_name" "text", "_last_name" "text", "_phone" "text", "_email" "text", "_date_of_birth" "date", "_company" "text", "_ship_country" "text", "_ship_city" "text", "_ship_street_name" "text", "_ship_street_number" "text", "_ship_postal" "text", "_ship_is_default" boolean, "_use_ship_as_bill" boolean, "_bill_country" "text", "_bill_city" "text", "_bill_street_name" "text", "_bill_street_number" "text", "_bill_postal" "text", "_bill_is_default" boolean) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  u uuid := auth.uid();
  billing_is_default boolean := false;
BEGIN
  -- Validate user is authenticated
  IF u IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  if _use_ship_as_bill and _ship_is_default then
    billing_is_default := true;
  end if;

  insert into public.customers (
    user_id, title, first_name, last_name, phone, email,
    date_of_birth, company, created_at, updated_at
  )
  values (
    u, _title, _first_name, _last_name, _phone, _email,
    _date_of_birth, _company, now(), now()
  )
  on conflict (user_id) do update
  set
    title = excluded.title,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone = excluded.phone,
    email = excluded.email,
    date_of_birth = excluded.date_of_birth,
    company = excluded.company,
    updated_at = now();

  insert into public.addresses (
    user_id,
    first_name, last_name, phone, email,
    country, city, street_name, street_number, postal_code,
    is_shipping_address, is_default_shipping,
    is_billing_address, is_default_billing
  ) values (
    u,
    _first_name, _last_name, _phone, _email,
    _ship_country, _ship_city, _ship_street_name, _ship_street_number, _ship_postal,
    true, _ship_is_default,
    _use_ship_as_bill, billing_is_default
  );

  if not _use_ship_as_bill then
    insert into public.addresses (
      user_id,
      first_name, last_name, phone, email,
      country, city, street_name, street_number, postal_code,
      is_shipping_address, is_default_shipping,
      is_billing_address, is_default_billing
    ) values (
      u,
      _first_name, _last_name, _phone, _email,
      _bill_country, _bill_city, _bill_street_name, _bill_street_number, _bill_postal,
      false, false,
      true, _bill_is_default
    );
  end if;
END;
$$;


ALTER FUNCTION "public"."complete_registration"("_title" "text", "_first_name" "text", "_last_name" "text", "_phone" "text", "_email" "text", "_date_of_birth" "date", "_company" "text", "_ship_country" "text", "_ship_city" "text", "_ship_street_name" "text", "_ship_street_number" "text", "_ship_postal" "text", "_ship_is_default" boolean, "_use_ship_as_bill" boolean, "_bill_country" "text", "_bill_city" "text", "_bill_street_name" "text", "_bill_street_number" "text", "_bill_postal" "text", "_bill_is_default" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_default_address"("_address_id" "uuid", "_address_type" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  u uuid := auth.uid();
begin
  perform 1 from public.addresses where id = _address_id and user_id = u;
  if not found then
    raise exception 'Address % not found or does not belong to current user', _address_id;
  end if;

  if _address_type = 'shipping' then
    update public.addresses
      set is_default_shipping = false
      where user_id = u and is_default_shipping;

    update public.addresses
      set is_default_shipping = true
      where id = _address_id and user_id = u;

  elsif _address_type = 'billing' then
    update public.addresses
      set is_default_billing = false
      where user_id = u and is_default_billing;

    update public.addresses
      set is_default_billing = true
      where id = _address_id and user_id = u;

  else
    raise exception 'address_type must be ''shipping'' or ''billing''';
  end if;
end;
$$;


ALTER FUNCTION "public"."set_default_address"("_address_id" "uuid", "_address_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_user_email"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    UPDATE auth.users 
    SET 
      email = NEW.email,
      updated_at = now()
    WHERE id = OLD.user_id;
    
    BEGIN
      INSERT INTO public.audit_logs (
        user_id, 
        action, 
        table_name, 
        record_id, 
        old_values, 
        new_values, 
        timestamp
      )
      VALUES (
        OLD.user_id, 
        'EMAIL_CHANGE', 
        'customers', 
        NEW.id, 
        jsonb_build_object('email', OLD.email),
        jsonb_build_object('email', NEW.email),
        NOW()
      );
    EXCEPTION
      WHEN undefined_table THEN
        NULL;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_user_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    
    IF (OLD.* IS DISTINCT FROM NEW.*) THEN
        NEW.updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "country" character(2) NOT NULL,
    "city" "text" NOT NULL,
    "postal_code" "text" NOT NULL,
    "is_default_shipping" boolean DEFAULT false NOT NULL,
    "is_default_billing" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_shipping_address" boolean DEFAULT false NOT NULL,
    "is_billing_address" boolean DEFAULT false NOT NULL,
    "email" "text",
    "phone" "text",
    "title" "text",
    "first_name" "text",
    "last_name" "text",
    "street_name" "text",
    "street_number" "text"
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."countries" (
    "iso_code" character(2) NOT NULL,
    "name" "text" NOT NULL,
    "region" "text" DEFAULT 'EU'::"text"
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "user_id" "uuid" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "company" "text",
    "date_of_birth" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "phone" "text" NOT NULL,
    "email" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("iso_code");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("user_id");



CREATE UNIQUE INDEX "unique_default_billing_address" ON "public"."addresses" USING "btree" ("user_id") WHERE ("is_default_billing" = true);



CREATE UNIQUE INDEX "unique_default_shipping_address" ON "public"."addresses" USING "btree" ("user_id") WHERE ("is_default_shipping" = true);



CREATE OR REPLACE TRIGGER "sync_customer_email_to_auth" AFTER UPDATE OF "email" ON "public"."customers" FOR EACH ROW WHEN (("old"."email" IS DISTINCT FROM "new"."email")) EXECUTE FUNCTION "public"."sync_user_email"();



CREATE OR REPLACE TRIGGER "update_addresses_modtime" BEFORE UPDATE ON "public"."addresses" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_customers_modtime" BEFORE UPDATE ON "public"."customers" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."customers"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "fk_country" FOREIGN KEY ("country") REFERENCES "public"."countries"("iso_code");



CREATE POLICY "Addresses: delete own" ON "public"."addresses" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Countries: allow select for all" ON "public"."countries" FOR SELECT USING (true);



CREATE POLICY "Customers: delete own" ON "public"."customers" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "addresses_insert_own" ON "public"."addresses" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "addresses_select_own" ON "public"."addresses" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "addresses_update_own" ON "public"."addresses" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "customers_insert_own" ON "public"."customers" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "customers_select_own" ON "public"."customers" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "customers_update_own" ON "public"."customers" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."clear_default_address"("_address_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."clear_default_address"("_address_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."clear_default_address"("_address_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."complete_registration"("_title" "text", "_first_name" "text", "_last_name" "text", "_phone" "text", "_email" "text", "_date_of_birth" "date", "_company" "text", "_ship_country" "text", "_ship_city" "text", "_ship_street_name" "text", "_ship_street_number" "text", "_ship_postal" "text", "_ship_is_default" boolean, "_use_ship_as_bill" boolean, "_bill_country" "text", "_bill_city" "text", "_bill_street_name" "text", "_bill_street_number" "text", "_bill_postal" "text", "_bill_is_default" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."complete_registration"("_title" "text", "_first_name" "text", "_last_name" "text", "_phone" "text", "_email" "text", "_date_of_birth" "date", "_company" "text", "_ship_country" "text", "_ship_city" "text", "_ship_street_name" "text", "_ship_street_number" "text", "_ship_postal" "text", "_ship_is_default" boolean, "_use_ship_as_bill" boolean, "_bill_country" "text", "_bill_city" "text", "_bill_street_name" "text", "_bill_street_number" "text", "_bill_postal" "text", "_bill_is_default" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."complete_registration"("_title" "text", "_first_name" "text", "_last_name" "text", "_phone" "text", "_email" "text", "_date_of_birth" "date", "_company" "text", "_ship_country" "text", "_ship_city" "text", "_ship_street_name" "text", "_ship_street_number" "text", "_ship_postal" "text", "_ship_is_default" boolean, "_use_ship_as_bill" boolean, "_bill_country" "text", "_bill_city" "text", "_bill_street_name" "text", "_bill_street_number" "text", "_bill_postal" "text", "_bill_is_default" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_default_address"("_address_id" "uuid", "_address_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_default_address"("_address_id" "uuid", "_address_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_default_address"("_address_id" "uuid", "_address_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_user_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_user_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_user_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";
GRANT INSERT ON TABLE "public"."customers" TO PUBLIC;









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
