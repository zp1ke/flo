import {
  Body,
  Button,
  CodeInline,
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
  preview: 'Hello ${profile.name}, recover your account.',
  recoverAccount:
    'We got you, follow the instructions to recover your account.',
  recoverNow: 'Recover now',
  thatsIt: "That's it! Nice to have you back.",
  thisVerification: 'This recovery was intended for',
  thisVerificationDescription:
    "If you were not expecting this recovery, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us.",
  welcome: 'Welcome back.',
};

export const UserRecovery = () => {
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
              {texts.welcome} {texts.recoverAccount}
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <Button
                href="${actionLink}"
                className="p-[10px_20px] bg-blue-400 text-white rounded"
              >
                {texts.recoverNow}
              </Button>
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              {texts.orCopyAndPaste} <CodeInline>{'${actionLink}'}</CodeInline>
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

export default UserRecovery;
