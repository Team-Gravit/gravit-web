export default function SocialButton({
  provider,
  imgSrc,
  onClick,
}: {
  provider: 'google' | 'kakao' | 'naver';
  imgSrc: string;
  onClick: () => void;
}) {
  return (
    <button type="button" id={provider} className="blcok cursor-pointer h-12" onClick={onClick}>
      <img className="w-full h-12 block object-fill" src={imgSrc} alt={provider} />
    </button>
  );
}
