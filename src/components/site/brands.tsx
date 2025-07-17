// src/components/TrustedBrands.tsx
const brandLogos = [
    "/logos/leela.png",
    "/logos/fisherman.png",
    "/logos/hyatt.png",
    "/logos/claridges.png",
    "/logos/effingut.png",
    "/logos/subko.png",
    "/logos/malaka.png",
    "/logos/holidayinn.png",
  ];
  
  export default function TrustedBrands() {
    return (
      <section className="py-20 bg-white text-center" id="brands">
        <h2 className="text-3xl font-bold text-orange-500 mb-12">
          Loved by 1500+ brands
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-4 max-w-6xl mx-auto items-center">
          {brandLogos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Brand logo"
              className="h-16 mx-auto object-contain"
            />
          ))}
        </div>
      </section>
    );
  }
  