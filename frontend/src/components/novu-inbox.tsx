import { Inbox } from '@novu/react';
import { useNavigate } from 'react-router';
 
export function NovuInbox() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const {uuid} = user;
  console.log(uuid);
 
  return (
    <Inbox
      applicationIdentifier="NAiOuTU5VtKH"
      subscriber={uuid}
      routerPush={(path: string) => navigate(path)}
    />
  );
}