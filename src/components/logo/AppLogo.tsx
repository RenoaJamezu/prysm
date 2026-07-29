type AppLogoProps = {
  logoClassName?: string;
};

export default function AppLogo({ logoClassName = "h-14" }: AppLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/images/logo.png"
        alt="PRYSM Logo"
        className={`w-auto object-contain ${logoClassName}`}
      />

      <h3 className="font-semibold">PRYSM</h3>
    </div>
  );
}
