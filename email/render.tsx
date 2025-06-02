import { render, pretty } from '@react-email/render';
import UserVerification from '~/user-verification';

const html = await pretty(await render(<UserVerification />));

console.log(html);
