install:
	pnpm install

start:
	pnpm dev

supabase.init:
	supabase init

supabase.login:
	supabase login

supabase.link:
	supabase link --project-ref $(project)

supabase.start:
	supabase start

supabase.start.db-only:
	supabase db start

supabase.stop:
	supabase stop

supabase.db.reset:
	supabase db reset

supabase.migrations.pull:
	supabase db pull

supabase.migrations.diff.local:
	supabase db diff -f $(name) --local

supabase.migrations.apply:
	supabase migrations up

supabase.migrations.new:
	supabase migration new $(name)

supabase.generate.types:
	supabase gen types typescript --project-id tlnboeuoaezawexbrblg --schema public > ./src/shared/api/database.types.ts

supabase.functions.serve:
	supabase functions serve --env-file ./supabase/.env.local

supabase.secrets.push:
	supabase secrets set --env-file ./supabase/.env.local
