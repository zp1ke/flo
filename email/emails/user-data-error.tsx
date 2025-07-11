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
  preview:
    'Hello ${profile.name}, there was an error with your requested data.',
  yourDataError:
    'Your requested data could not be retrieved. Please try again later or contact support.',
  thatsIt: "That's it! Nice to have you with us.",
  thisVerification: 'This email is intended for',
  thisVerificationDescription:
    "If you were not expecting this, you can ignore this email. If you are concerned about your account's safety, please reply to this email to get in touch with us.",
};

const leadingIcon = '⚠️';

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
            <Text className="text-[16px] text-red-500 leading-[24px]">
              {leadingIcon} {texts.yourDataError}
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
