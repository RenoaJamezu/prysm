import CreateBusinessForm from "../components/CreateBusinessForm";
import OnboardingLayout from "../layout/OnBoardingLayout";

export default function CreateBusinessPage() {
  return (
    <OnboardingLayout
      title="Let's set up your business"
      description="Tell us a little about your business before continuing."
    >
      <CreateBusinessForm />
    </OnboardingLayout>
  );
}
