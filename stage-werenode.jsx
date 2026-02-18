import React, { useState, useEffect } from 'react';
import { Battery, Zap, Code, Server, Users, Calendar, MapPin, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

export default function StageWerenode() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const missions = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Développement Full-Stack",
      description: "Conception et développement d'applications web avec React, Node.js et bases de données",
      tags: ["React", "Node.js", "PostgreSQL"]
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Infrastructure Cloud",
      description: "Déploiement et maintenance de services sur infrastructure AWS et Docker",
      tags: ["AWS", "Docker", "CI/CD"]
    },
    {
      icon: <Battery className="w-6 h-6" />,
      title: "IoT & Smart Charging",
      description: "Intégration de solutions IoT pour la gestion intelligente de bornes de recharge",
      tags: ["IoT", "MQTT", "APIs"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Travail en Équipe Agile",
      description: "Collaboration avec l'équipe tech en méthode Scrum, code reviews et pair programming",
      tags: ["Scrum", "Git", "Jira"]
    }
  ];

  const competences = [
    { nom: "React & TypeScript", niveau: 85 },
    { nom: "Node.js & Express", niveau: 80 },
    { nom: "PostgreSQL & MongoDB", niveau: 75 },
    { nom: "Docker & AWS", niveau: 70 },
    { nom: "APIs REST & GraphQL", niveau: 80 },
    { nom: "Git & CI/CD", niveau: 85 }
  ];

  const timeline = [
    { mois: "Mois 1-2", titre: "Onboarding & Formation", desc: "Découverte de l'écosystème Werenode et montée en compétences" },
    { mois: "Mois 3-4", titre: "Premiers Projets", desc: "Développement de features pour la plateforme de charging" },
    { mois: "Mois 5-6", titre: "Autonomie & Impact", desc: "Gestion de projets complets et contributions majeures" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div 
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-[120px]"
          style={{ 
            top: '10%', 
            left: '10%',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-[120px]"
          style={{ 
            bottom: '20%', 
            right: '10%',
            transform: `translate(-${scrollY * 0.08}px, -${scrollY * 0.06}px)`
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0e27]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Stage Werenode
            </span>
          </div>
          <div className="flex gap-4">
            <a href="#missions" className="px-4 py-2 hover:text-emerald-400 transition-colors">Missions</a>
            <a href="#competences" className="px-4 py-2 hover:text-emerald-400 transition-colors">Compétences</a>
            <a href="#contact" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-8 animate-[fadeIn_1s_ease-out]">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Stage 6 mois • 2024-2025</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-6 animate-[fadeIn_1s_ease-out_0.2s_both]">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
              Mon Stage chez
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Werenode
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto animate-[fadeIn_1s_ease-out_0.4s_both]">
            Développeur Full-Stack • Solutions de Recharge Intelligente pour Véhicules Électriques
          </p>
          
          <div className="flex items-center justify-center gap-3 text-gray-400 mb-12 animate-[fadeIn_1s_ease-out_0.6s_both]">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Saint-Quentin-en-Yvelines, France</span>
          </div>

          <div className="flex gap-4 justify-center animate-[fadeIn_1s_ease-out_0.8s_both]">
            <a 
              href="#missions" 
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold flex items-center gap-2 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105"
            >
              Découvrir mes missions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#competences" 
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105"
            >
              Voir mes compétences
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto animate-[fadeIn_1s_ease-out_1s_both]">
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="text-4xl font-bold text-emerald-400 mb-2">6</div>
              <div className="text-gray-400">Mois de stage</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10+</div>
              <div className="text-gray-400">Projets réalisés</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-400">Motivation</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-[slideDown_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* Missions Section */}
      <section id="missions" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Mes Missions
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Un aperçu des projets et responsabilités confiés durant mon stage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {missions.map((mission, i) => (
              <div 
                key={i}
                className="group p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {mission.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{mission.title}</h3>
                <p className="text-gray-400 mb-6">{mission.description}</p>
                <div className="flex flex-wrap gap-2">
                  {mission.tags.map((tag, j) => (
                    <span 
                      key={j} 
                      className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-32 px-6 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Parcours du Stage
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-purple-500" />

            {timeline.map((item, i) => (
              <div 
                key={i} 
                className={`relative flex items-center gap-8 mb-16 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="inline-block p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:scale-105 transition-transform">
                    <div className="text-emerald-400 font-bold mb-2">{item.mois}</div>
                    <h3 className="text-2xl font-bold mb-2">{item.titre}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
                
                <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full border-4 border-[#0a0e27] z-10" />
                
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compétences Section */}
      <section id="competences" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Compétences Acquises
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Technologies et outils maîtrisés durant le stage
            </p>
          </div>

          <div className="grid gap-6">
            {competences.map((comp, i) => (
              <div 
                key={i}
                className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold">{comp.nom}</span>
                  <span className="text-purple-400 font-bold">{comp.niveau}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-purple-500/50"
                    style={{ 
                      width: `${comp.niveau}%`,
                      animation: `growWidth 1.5s ease-out ${i * 0.1}s both`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Restons en Contact
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Intéressé par mon parcours ? Discutons !
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all hover:scale-105 flex items-center gap-3"
            >
              <Github className="w-6 h-6 group-hover:text-emerald-400 transition-colors" />
              <span className="font-semibold">GitHub</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all hover:scale-105 flex items-center gap-3"
            >
              <Linkedin className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
              <span className="font-semibold">LinkedIn</span>
            </a>
            <a 
              href="mailto:contact@example.com"
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center gap-3 font-semibold"
            >
              <Mail className="w-6 h-6" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-400" />
            <span>Stage Werenode 2024-2025</span>
          </div>
          <div>
            Fait avec ❤️ et React
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        @keyframes growWidth {
          from {
            width: 0;
          }
        }
      `}</style>
    </div>
  );
}
