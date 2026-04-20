import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <section id="about" className="py-24 px-6 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5">
              About Ahura NDIS
            </h2>
            <p className="text-[#cbd5e1] leading-relaxed mb-4">
              Ahura is a participant-first support provider focused on helping people live with choice, dignity, and confidence.
            </p>
            <p className="text-[#cbd5e1] leading-relaxed">
              We partner with participants, carers, and families to provide consistent support workers, transparent communication, and outcomes that align with personal goals.
            </p>
          </div>
          <div className="rounded-2xl border border-[#334155] bg-[#111827] p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Why families choose us</h3>
            <ul className="space-y-3 text-[#cbd5e1] text-sm sm:text-base">
              <li>• Person-centred care plans tailored to each participant</li>
              <li>• Reliable support workers with clear communication</li>
              <li>• Culturally aware and inclusive service delivery</li>
              <li>• Ongoing review meetings to track progress and goals</li>
            </ul>
          </div>
        </div>
      </section>
      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Ready to Start Your NDIS Journey?
          </h2>
          <p className="text-[#94a3b8] text-lg mb-8">
            Contact our team today for a free consultation and personalised support plan.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#334155] bg-[#111827] p-5">
              <p className="text-sm text-[#94a3b8]">Phone</p>
              <p className="text-white font-semibold">1300 000 000</p>
            </div>
            <div className="rounded-xl border border-[#334155] bg-[#111827] p-5">
              <p className="text-sm text-[#94a3b8]">Email</p>
              <p className="text-white font-semibold">support@ahurandis.com.au</p>
            </div>
            <div className="rounded-xl border border-[#334155] bg-[#111827] p-5">
              <p className="text-sm text-[#94a3b8]">Hours</p>
              <p className="text-white font-semibold">Mon–Fri, 8am–6pm</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
