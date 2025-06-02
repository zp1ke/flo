import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

export const UserVerification = () => {
  const previewText = 'Hello ${profile.name}, please verify your email address.';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Img
              src="https://reactrouter.com/_brand/React%20Router%20Brand%20Assets/React%20Router%20Lockup/Light.svg"
              height="24"
              alt="Flo"
              className="mx-auto my-0"
            />
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Hello <strong>{'${profile.name}'}</strong>,
            </Heading>
            <Text className="text-[16px] text-black leading-[24px]">
              Welcome aboard! Please verify your email address.
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <Link href="${verificationLink}" className="text-blue-600 no-underline">
                Verify now
              </Link>
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href="${verificationLink}" className="text-blue-600 no-underline">
                Verification Link
              </Link>
            </Text>
            <Text className="text-[12px] text-black leading-[24px]">
              That's it! Nice to have you onboard.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{' '}
              <span className="text-black">{'${profile.name}'}</span>. If you were not expecting
              this invitation, you can ignore this email. If you are concerned about your account's
              safety, please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserVerification;
