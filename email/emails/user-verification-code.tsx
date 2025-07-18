import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

const texts = {
  lang: 'en',
  hello: 'Hello',
  orCopyAndPaste: 'or copy and paste this URL into your browser:',
  preview: 'Hello ${profile.name}, this is your verification code.',
  thatsIt: "That's it! Nice to have you with us.",
  thisVerification: 'This verification code was intended for',
  thisVerificationDescription:
    "If you were not expecting this verification code, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us.",
  yourCode: 'Your verification code is:',
};

const leadingIcon = '🔑';

export const UserVerification = () => {
  return (
    <Html lang={texts.lang}>
      <Head>
        <title>{texts.preview}</title>
      </Head>
      <Preview>{texts.preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-gray-200 border-solid p-[20px]">
            <Img
              src={'${logoImageUrl}'}
              height="24"
              alt="Flo"
              className="mx-auto my-0"
            />
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              {texts.hello} <strong>{'${profile.name}'}</strong>,
            </Heading>
            <Text className="text-[16px] text-black leading-[24px]">
              {leadingIcon} {texts.yourCode}{' '}
              <strong>{'${user.verifyCode}'}</strong>
            </Text>
            <Text className="text-[12px] text-black leading-[24px]">
              {texts.thatsIt}
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-gray-300 border-solid" />
            <Text className="text-gray-500 text-[12px] leading-[24px]">
              {texts.thisVerification}{' '}
              <span className="text-black">{'${profile.name}'}</span>.{' '}
              {texts.thisVerificationDescription}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default UserVerification;
