export function About() {
  return (
    <section id="about" className="flex h-screen items-center justify-center">
      <section
        id="map"
        className="flex h-auto flex-col items-center justify-center"
        style={{
          backgroundImage: "url(map.svg)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: 600,
          width: 1000,
        }}
      >
        <h1 className="font-k2d text-center text-[40px] font-bold text-[#8E3B46]">
          About <br /> KnightHacks
        </h1>
        <p className="font-k2d mb-20 mt-10 text-center text-[35px] font-semibold leading-[65px] text-[#8E3B46]">
          Lorem ipsum dolor sit amet, consectetur <br /> adipiscing elit, sed do
          eiusmod tempor
          <br /> incididunt ut labore et dolore magna aliqua. Ut <br /> enim ad
          minim veniam, quis nostrud <br /> exercitation.
        </p>
      </section>
    </section>
  );
}
