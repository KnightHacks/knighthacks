import Image from "next/image";
import { Button } from "@knighthacks/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-between gap-5 bg-[#0D3047] px-3 pb-2 pt-5 md:px-12">
      <div className="flex flex-col items-center gap-5 md:flex-row">
        <a
          className="flex h-20 items-center"
          href="https://github.com/KnightHacks "
        >
          <Image
            src={"/kh-logo.svg"}
            alt={"@knighthacks"}
            width={200}
            height={50}
          />
        </a>
        <a href="https://discord.com/invite/Kv5g9vf">
          <Button className="flex h-12 w-36 items-center justify-center rounded-full bg-[#DBC04A] text-sm text-white opacity-[80%] md:w-48 md:text-lg">
            Join Our Discord
          </Button>
        </a>
      </div>
      <div className="flex flex-col items-center gap-5 md:flex-row-reverse">
        <div className="flex h-20 items-center gap-5 text-[#DBC04A]">
          <div>
            <b className="text-lg">Resources</b>
            <p>
              <a href="https://2024.knighthacks.org/application/profile">
                Register
              </a>
            </p>
            <p>
              <a href="#faq">FAQ</a>
            </p>
          </div>

          <div>
            <b className="text-lg">Links</b>
            <p>
              <a href="">Schedule</a>
            </p>
            <p>
              <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">
                MLH
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <a className="pr-4" href="https://discord.com/invite/Kv5g9vf">
            <Image src="/discord.svg" alt="discord" width={50} height={50} />
          </a>
          <a className="pr-4" href="https://www.instagram.com/knighthacks">
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={50}
              height={50}
            />
          </a>
          <a href="https://linktr.ee/knighthacks">
            <Image src="/LinkTree.svg" alt="twitter" width={50} height={50} />
          </a>
        </div>
      </div>
    </footer>
  );
}
