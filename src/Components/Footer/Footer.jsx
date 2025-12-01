"use client";
import Link from "next/link";
import Image from "next/image";

const content = [
  {
    title: "Our Commitment to ",
    coretitle: "Sustainable Fashion",
    description:
      "At Piggy Almari, we believe fashion should be as kind to the planet as it is to your style. Our mission is to redefine the way people experience fashion — through sharing, reusing, and conscious consumption.",
  },
  {
    title: "Make Every ",
    coretitle: "Occasion Memorable",
    description:
      "Choose from a wide collection of ethnic, western, and fusion looks — all available to rent, buy, or sell at your convenience. Because with Piggy Almari, every occasion deserves a touch of elegance and unforgettable fashion.",
  },
  {
    title: "Happy Users",
    coretitle: "Users",
    description:
      "Over 10,000+ satisfied fashion lovers trust Piggy Almari for their daily style needs. From college fests to grand weddings, our users love the freedom to rent, buy, and sell fashion without limits.",
  },
  {
    title: "Styles ",
    coretitle: "Available",
    description:
      "Discover thousands of unique looks – from ethnic wear and party gowns to casual fits and accessories. Piggy Almari brings every trend to your fingertips so you can stay fashionable for every occasion.",
  },
  {
    title: "Daily ",
    coretitle: "Rentals",
    description:
      "With hundreds of daily rentals, we’re redefining smart fashion choices. Rent premium outfits at a fraction of the price, look stunning, and return them hassle-free  fashion made easy!",
  },
];
export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-light-gray text-theme-black">
        <div className="mx-auto container px-5 pb-25 pt-12.5">
          <div className="mb-7.5">
            <h3 className="fs-30 font-bold mb-5">
              About <span className="text-dark-gray">Piggy Almari</span>
            </h3>
            <div className="flex flex-col gap-5">
              <p className="fs-md">
                Rent. Buy. Sell. Repeat — Fashion made smarter!
                <br />
                Piggy Almari is a modern fashion-sharing platform where style
                meets sustainability. We make it easy for you to rent, buy, or
                sell clothes, shoes, and accessories all in one place.
              </p>
              <p className="fs-md">
                Rent: Look stunning for every occasion without spending big.
                <br />
                Buy: Discover premium pieces at pocket-friendly prices.
                <br />
                Sell: Turn your wardrobe into income by sharing your style.
              </p>
              <p className="fs-md">
                At Piggy Almari, we believe fashion should be accessible,
                affordable, and sustainable — because great style shouldn’t come
                with limits. Piggy Almari — Your Smart Wardrobe Partner.
              </p>
            </div>
          </div>

          <div className="mb-7.5">
            <h4 className="fs-30 font-bold mb-5">
              Why Choose <span className="text-dark-gray">Piggy Almari?</span>
            </h4>
            <ol className="list-decimal space-y-5 pl-5 fs-md">
              <li>
                Rent, Buy, or Sell – All in One Place <br />
                From glamorous party wear to casual chic, Piggy Almari lets you
                rent, buy, or sell fashion pieces effortlessly.
              </li>
              <li>
                Affordable Luxury for Everyone <br />
                Look stunning without breaking the bank — enjoy premium styles
                at pocket-friendly prices.
              </li>
              <li>
                Endless Variety, One Platform <br />
                Discover thousands of trendy outfits and accessories for every
                occasion and mood.
              </li>
              <li>
                Sustainable Fashion Choice <br />
                Join the movement to reduce fashion waste by sharing, reusing,
                and re-loving clothes.
              </li>
              <li>
                Hassle-Free Experience <br />
                Easy browsing, secure payments, and doorstep delivery make your
                style journey seamless.
              </li>
            </ol>
          </div>

          {content.map((item, i) => (
            <div key={i} className="mb-7.5">
              <h5 className="fs-30 font-bold mb-5">
                {item.title}
                <span className="text-dark-gray">{item.coretitle}</span>
              </h5>
              <p className="fs-md">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-theme-black text-white py-7.5">
        <p className="fs-lg font-normal text-center">Download App</p>
        <div className=" flex flex-col items-center ">
          <div className="flex items-center gap-3 mb-7.5 mt-5">
            <Link
              href="https://play.google.com/store/apps/details?id=my.piggy.almari.trendy.style.rental"
              className="inline-block hover:opacity-90 transition-opacity"
              aria-label="Get it on Google Play"
              target="_blank"
            >
              <Image
                src="/Google.png"
                alt="Get it on Google Play"
                width={162}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <Link
              href="https://apps.apple.com/in/app/piggy-almari-trends-on-rent/id6742538964"
              className="inline-block hover:opacity-90 transition-opacity"
              aria-label="Download on the App Store"
              target="_blank"
            >
              <Image
                src="/AppStore.png"
                alt="Download on the App Store"
                width={162}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <h6 className="fs-20">
            © 2025 PIGGY ALMARI. All Rights Reserved.
          </h6>
        </div>
      </div>
    </footer>
  );
}
