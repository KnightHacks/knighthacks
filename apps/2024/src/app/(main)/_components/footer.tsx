import { Button } from "@knighthacks/ui/button";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-between bg-[#0D3047] pb-2 pt-5 px-3 md:px-12 gap-5">
      <div className="flex flex-col md:flex-row items-center gap-5">
        <a className="h-20 flex items-center" href="https://github.com/KnightHacks ">
          <Image
            src={"/kh-logo.svg"}
            alt={"@knighthacks"}
            width={200}
            height={50}
          />
        </a>
        <a href="https://discord.com/invite/Kv5g9vf">
          <Button className="rounded-full w-36 text-sm md:w-48 md:text-lg h-12 bg-[#DBC04A] opacity-[80%] text-white flex justify-center items-center">Join Our Discord</Button>
        </a>
      </div>
      <div className="flex flex-col md:flex-row-reverse items-center gap-5">
        <div className="flex items-center text-[#DBC04A] gap-5 h-20">
          <div>
            <b className="text-lg">Resources</b>
            <p><a href="https://2024.knighthacks.org/application/profile">Register</a></p>
            <p><a href="#faq">FAQ</a></p>
          </div>

          <div>
            <b className="text-lg">Links</b>
            <p><a href="">Schedule</a></p>
            <p><a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH</a></p>
          </div>
        </div>
        <div className="flex items-center">
          <a className="pr-4" href="https://discord.com/invite/Kv5g9vf">
            <Image src="/discord.svg" alt="discord" width={50} height={50} />
          </a>
          <a className="pr-4" href="https://www.instagram.com/knighthacks">
            <Image src="/instagram.svg" alt="instagram" width={50} height={50} />
          </a>
          <a href="https://linktr.ee/knighthacks">
            <Image src="/LinkTree.svg" alt="twitter" width={50} height={50} />
          </a>
        </div>
      </div>
    </footer>
  );
}
