import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-around bg-[#081D2B] pb-2 pt-5">
      <div className="flex">
        <a href="https://github.com/KnightHacks">
          <Image
            src={"/kh-logo.svg"}
            alt={"@knighthacks"}
            width={125}
            height={50}
          />
        </a>
      </div>
      <div className="flex items-center">
        <a className="pr-4" href="https://discord.com/invite/Kv5g9vf">
          <Image src="/discord.svg" alt="discord" width={35} height={35} />
        </a>
        <a className="pr-4" href="https://www.instagram.com/knighthacks">
          <Image src="/instagram.svg" alt="instagram" width={35} height={35} />
        </a>
        <a href="https://linktr.ee/knighthacks">
          <Image src="/LinkTree.svg" alt="twitter" width={35} height={35} />
        </a>
      </div>
    </footer>
  );
}
