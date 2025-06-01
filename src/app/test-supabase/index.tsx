import { useEffect, useState } from 'react';

import { supabase } from '@/shared/api/supabase-client';

const TestSupabase = (): React.JSX.Element => {
  const [users, setUsers] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    getInstruments();
  }, []);

  const getInstruments = async (): Promise<void> => {
    const { data } = await supabase.from('users').select('*');
    if (data) setUsers(data);
  };
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default TestSupabase;
