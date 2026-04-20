export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="inline-flex rounded-full border border-[#2a2a2a] bg-[#141414] px-4 py-1 text-sm text-[#b3b3b3]">
          Ahura Studio
        </p>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
          We design and build fast, modern websites.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#b3b3b3]">
          From landing pages to full product websites, we create polished web
          experiences that help your business look credible and grow online.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#contact"
            className="rounded-xl bg-[#e50914] px-6 py-3 text-center font-semibold text-white hover:bg-[#f6121d]"
          >
            Start a Project
          </a>
          <a
            href="#services"
            className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-6 py-3 text-center font-semibold text-white hover:bg-[#1c1c1c]"
          >
            View Services
          </a>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-bold sm:text-3xl">What we build</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Marketing Websites",
              description:
                "High-converting pages with clear messaging and strong visual polish.",
            },
            {
              title: "Product Sites",
              description:
                "Documentation, pricing, and onboarding experiences for software products.",
            },
            {
              title: "Content Platforms",
              description:
                "Scalable blog and resource hubs optimized for speed and SEO.",
            },
          ].map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6"
            >
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-[#b3b3b3]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-[#2a2a2a] bg-[#111111]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Let’s build your website</h2>
          <p className="mt-4 max-w-xl text-[#b3b3b3]">
            Tell us what you need and we’ll send a tailored proposal.
          </p>
          <a
            href="mailto:hello@ahura.studio"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-[#e6e6e6]"
          >
            hello@ahura.studio
          </a>
        </div>
      </section>
    </main>
  );
}
