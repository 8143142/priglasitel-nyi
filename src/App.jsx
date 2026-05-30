import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Heart, ChevronDown, Navigation, Sparkles, Languages, Copy, Check, Music2, PlayCircle, PauseCircle } from "lucide-react";

const EVENT_DATE_ISO = "2026-07-10T17:00:00+05:00"; // Уақытын өзгерту керек болса: 17:00 орнына нақты уақытты қойыңыз
const TWO_GIS_URL = "https://go.2gis.com/j9peu";
// 2GIS не разрешает открываться внутри iframe, поэтому карту показываем через OpenStreetMap, а кнопку оставляем на 2GIS
const OSM_MAP_URL = "https://www.openstreetmap.org/export/embed.html?bbox=63.613678%2C53.237314%2C63.625678%2C53.243314&layer=mapnik&marker=53.240314%2C63.619678";
const PHONE_WHATSAPP = "77072353517"; // WhatsApp нөмірі: +7 707 235 3517
const MUSIC_URL = "/music.mp3"; // public/music.mp3 файлын осы атпен салыңыз

const content = {
  kz: {
    langLabel: "Қазақша",
    topNote: "Арнайы шақыру",
    title: "Кенестің 50 жас мерейтойы",
    subtitle: "Асқар тау әкеміздің мерейлі жасына арналған салтанатты ақ дастархан",
    badge: "50 жас",
    date: "10 шілде 2026",
    time: "17:00",
    place: "«Ралина» банкет залы",
    address: "«Ралина» банкет залы, Қамшат Дөненбаева көшесі, 99, Қостанай",
    inviteTitle: "Қадірлі қонағымыз болыңыз!",
    inviteText:
      "Құрметті ағайын-туыс, бауырлар, нағашы-жиендер, бөлелер, құда-жекжаттар, дос-жарандар, қадірлі әріптестер мен жолдастар! Сіздерді асқар тау әкеміз Кенестің 50 жас мерейтойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    familyLine: "Ізгі ниетпен, той иелері",
    countdownTitle: "Тойға дейін",
    days: "күн",
    hours: "сағат",
    minutes: "минут",
    seconds: "секунд",
    programTitle: "Кеш бағдарламасы",
    program: ["Қонақтарды қарсы алу", "Ақ дастархан және құттықтаулар", "Музыка, естеліктер және мерекелік көңіл-күй"],
    locationTitle: "Өтетін орны",
    openMap: "2GIS арқылы ашу",
    whatsapp: "Қатысуымды хабарлау",
    copyLink: "Сілтемені көшіру",
    copied: "Көшірілді",
    scroll: "Төмен қарай",
    rsvpTitle: "Тойға қатысуыңызды растаңыз",
    rsvpSubtitle: "Аты-жөніңізді жазып, өзіңізге ыңғайлы жауапты таңдаңыз. Жауап WhatsApp арқылы жіберіледі.",
    nameLabel: "Аты-жөніңіз",
    namePlaceholder: "Мысалы: Нұрлан Әбдірахманов",
    rsvpQuestion: "Тойға келесіз бе?",
    rsvpOptions: ["Иә, әрине, келемін", "Жұбайыммен келемін", "Өкінішке орай, келе алмаймын"],
    sendRsvp: "Жіберу",
    rsvpSent: "Жауабыңыз дайын! WhatsApp ашылады",
    musicOn: "Музыканы қосу",
    musicOff: "Музыканы өшіру"
  },
  ru: {
    langLabel: "Русский",
    topNote: "Персональное приглашение",
    title: "50-летний юбилей Кенеса",
    subtitle: "Торжественный дастархан в честь юбилея нашего дорогого отца",
    badge: "50 лет",
    date: "10 июля 2026",
    time: "17:00",
    place: "банкетный зал «Ралина»",
    address: "Банкетный зал «Ралина», улица Камшат Доненбаевой, 99, Костанай",
    inviteTitle: "Будьте нашим дорогим гостем!",
    inviteText:
      "Уважаемые родственники, братья и сестры, племянники, сваты, друзья, дорогие коллеги и близкие! Приглашаем вас стать почётными гостями торжественного дастархана, посвящённого 50-летнему юбилею нашего дорогого отца Кенеса.",
    familyLine: "С уважением, хозяева торжества",
    countdownTitle: "До торжества осталось",
    days: "дней",
    hours: "часов",
    minutes: "минут",
    seconds: "секунд",
    programTitle: "Программа вечера",
    program: ["Встреча гостей", "Праздничный дастархан и поздравления", "Музыка, воспоминания и тёплая атмосфера"],
    locationTitle: "Место проведения",
    openMap: "Открыть в 2GIS",
    whatsapp: "Подтвердить участие",
    copyLink: "Скопировать ссылку",
    copied: "Скопировано",
    scroll: "Листайте вниз",
    rsvpTitle: "Подтвердите участие",
    rsvpSubtitle: "Напишите имя и выберите удобный вариант ответа. Ответ будет отправлен через WhatsApp.",
    nameLabel: "Ваше имя",
    namePlaceholder: "Например: Нурлан Абдрахманов",
    rsvpQuestion: "Вы будете на торжестве?",
    rsvpOptions: ["Да, конечно, приду", "Приду с супругой/супругом", "К сожалению, не смогу прийти"],
    sendRsvp: "Отправить",
    rsvpSent: "Ответ готов! Откроется WhatsApp",
    musicOn: "Включить музыку",
    musicOff: "Выключить музыку"
  }
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ children, className = "", asChild = false, variant, ...props }) {
  const baseClass = cn(
    "inline-flex items-center justify-center rounded-full border border-transparent font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950",
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(baseClass, children.props.className || "")
    });
  }

  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={cn("rounded-2xl border", className)}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function getTimeLeft() {
  const distance = new Date(EVENT_DATE_ISO).getTime() - Date.now();
  const safeDistance = Math.max(0, distance);
  return {
    days: Math.floor(safeDistance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safeDistance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safeDistance / (1000 * 60)) % 60),
    seconds: Math.floor((safeDistance / 1000) % 60)
  };
}

function FloatingStone({ className = "", delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-[38%_62%_48%_52%] bg-gradient-to-br from-amber-200/25 via-white/15 to-blue-950/10 blur-[0.2px] ${className}`}
      animate={{ y: [0, -18, 0], rotate: [0, 6, -2, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

function Balloon({ className = "", color = "#081832", delay = 0 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -14, 0], rotate: [-2, 3, -2] }}
      transition={{ duration: 6.5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div className="relative h-full w-full rounded-[50%_50%_46%_46%] shadow-2xl" style={{ background: `radial-gradient(circle at 35% 22%, rgba(255,255,255,.35), transparent 18%), ${color}` }}>
        <div className="absolute bottom-[-7px] left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent" style={{ borderTopColor: color }} />
        <div className="absolute left-1/2 top-full h-20 w-px -translate-x-1/2 bg-white/25" />
      </div>
    </motion.div>
  );
}

function CounterBox({ value, label }) {
  return (
    <Card className="border-stone-200 bg-stone-950 text-white shadow-2xl shadow-stone-300/40">
      <CardContent className="p-4 text-center sm:p-5">
        <div className="text-4xl font-bold tracking-tight text-amber-100 sm:text-6xl">{String(value).padStart(2, "0")}</div>
        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">{label}</div>
      </CardContent>
    </Card>
  );
}

function DetailPill({ icon: Icon, title, value }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-xl"
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/55">{title}</div>
        <div className="font-medium">{value}</div>
      </div>
    </motion.div>
  );
}

export default function Kenes50Invitation() {
  const [lang, setLang] = useState("kz");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [copied, setCopied] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpSent, setRsvpSent] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const t = content[lang];

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const whatsappText = useMemo(() => {
    const text = lang === "kz"
      ? "Сәлеметсіз бе! Кенестің 50 жас мерейтойына қатысатынымды хабарлаймын."
      : "Здравствуйте! Подтверждаю участие на 50-летнем юбилее Кенеса.";
    return `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(text)}`;
  }, [lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleRsvpSubmit = (event) => {
    event.preventDefault();
    const selectedStatus = rsvpStatus || t.rsvpOptions[0];
    const name = guestName.trim() || (lang === "kz" ? "Қонақ" : "Гость");
    const message = lang === "kz"
      ? `Сәлеметсіз бе! Кенестің 50 жас мерейтойына жауап: ${selectedStatus}. Аты-жөнім: ${name}.`
      : `Здравствуйте! Ответ на приглашение на 50-летний юбилей Кенеса: ${selectedStatus}. Имя: ${name}.`;
    setRsvpSent(true);
    window.open(`https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noreferrer");
    setTimeout(() => setRsvpSent(false), 2200);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.volume = 0.45;
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch {
      setIsMusicPlaying(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#15120f] text-stone-950">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />
      <button
        onClick={toggleMusic}
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-200/40 bg-stone-950 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-stone-950/40 backdrop-blur-xl transition hover:scale-[1.02] hover:bg-stone-800 sm:text-base"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-stone-950">
          <span className={`absolute inset-0 rounded-full bg-amber-200 ${isMusicPlaying ? "animate-ping opacity-40" : ""}`} />
          {isMusicPlaying ? <PauseCircle className="relative h-6 w-6" /> : <PlayCircle className="relative h-6 w-6" />}
        </span>
        <span>{isMusicPlaying ? t.musicOff : t.musicOn}</span>
      </button>
      <section className="relative min-h-screen px-4 py-6 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,244,214,0.34),transparent_28%),radial-gradient(circle_at_18%_28%,rgba(199,154,66,0.22),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(8,24,50,0.72),transparent_28%),linear-gradient(135deg,#0a1224_0%,#1b263d_30%,#c5a15a_62%,#f8f0df_100%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:74px_74px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f6efe4] via-transparent to-transparent" />
        <Balloon className="left-4 top-20 h-28 w-24 sm:left-10 sm:h-36 sm:w-28" color="#071832" />
        <Balloon className="left-20 top-10 h-24 w-20 sm:left-32 sm:h-32 sm:w-24" color="#c79a42" delay={1.2} />
        <Balloon className="right-5 top-16 h-28 w-24 sm:right-12 sm:h-36 sm:w-28" color="#071832" delay={0.6} />
        <Balloon className="right-24 top-28 h-20 w-16 sm:right-40 sm:h-28 sm:w-22" color="#c79a42" delay={1.8} />
        <FloatingStone className="bottom-24 left-1/4 h-20 w-24" delay={2.7} />
        <FloatingStone className="bottom-36 right-1/4 h-12 w-16" delay={0.8} />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl flex-col">
          <header className="flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200/35 bg-white/15 shadow-2xl backdrop-blur-xl">
                <Sparkles className="h-6 w-6 text-amber-100" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.28em] text-amber-100">KENES</div>
                <div className="text-xs text-white/55">50 years celebration</div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLang(lang === "kz" ? "ru" : "kz")}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-xl backdrop-blur-xl transition hover:bg-white/15"
            >
              <Languages className="h-4 w-4" />
              {lang === "kz" ? "RU" : "KZ"}
            </motion.button>
          </header>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-100/10 px-4 py-2 text-sm text-amber-100 shadow-xl backdrop-blur-xl"
              >
                <Heart className="h-4 w-4" />
                {t.topNote}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#fff7e8] drop-shadow-[0_12px_35px_rgba(0,0,0,.35)] sm:text-7xl lg:text-8xl"
              >
                {t.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl"
              >
                {t.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-8 grid gap-3 sm:grid-cols-3"
              >
                <DetailPill icon={CalendarDays} title={lang === "kz" ? "Күні" : "Дата"} value={t.date} />
                <DetailPill icon={Clock} title={lang === "kz" ? "Уақыты" : "Время"} value={t.time} />
                <DetailPill icon={MapPin} title={lang === "kz" ? "Өтетін орны" : "Место"} value={t.place} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Button asChild className="rounded-full bg-amber-200 px-6 py-6 text-base font-semibold text-stone-950 hover:bg-amber-100">
                  <a href={TWO_GIS_URL} target="_blank" rel="noreferrer">
                    <Navigation className="mr-2 h-5 w-5" />
                    {t.openMap}
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/10 px-6 py-6 text-base font-semibold text-white backdrop-blur-xl hover:bg-white/15 hover:text-white">
                  <a href={whatsappText} target="_blank" rel="noreferrer">
                    <Heart className="mr-2 h-5 w-5" />
                    {t.whatsapp}
                  </a>
                </Button>
                <Button onClick={handleCopy} variant="outline" className="rounded-full border-white/20 bg-white/10 px-6 py-6 text-base font-semibold text-white backdrop-blur-xl hover:bg-white/15 hover:text-white">
                  {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                  {copied ? t.copied : t.copyLink}
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.18 }}
              className="relative mx-auto w-full max-w-[540px]"
            >
              <div className="absolute -inset-5 rounded-[3rem] bg-amber-200/25 blur-3xl" />
              <div className="relative min-h-[560px] overflow-hidden rounded-[2.8rem] border border-amber-100/35 bg-[linear-gradient(180deg,rgba(255,248,232,.94),rgba(248,239,220,.86))] p-5 shadow-2xl shadow-stone-950/35 backdrop-blur-2xl">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,rgba(199,154,66,.35)_0,transparent_24%),radial-gradient(circle_at_80%_10%,rgba(8,24,50,.25)_0,transparent_22%)]" />
                <div className="absolute -left-8 bottom-28 flex rotate-[-18deg] gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={`left-${i}`} className={`block h-12 w-12 rounded-full shadow-xl ${i % 2 ? "bg-[#c79a42]" : "bg-[#071832]"}`} />
                  ))}
                </div>
                <div className="absolute -right-8 bottom-28 flex rotate-[18deg] gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={`right-${i}`} className={`block h-12 w-12 rounded-full shadow-xl ${i % 2 ? "bg-[#071832]" : "bg-[#c79a42]"}`} />
                  ))}
                </div>
                <div className="relative z-10 rounded-[2.1rem] border border-amber-300/50 bg-[#fffaf0]/85 p-7 text-center shadow-inner">
                  <div className="mx-auto mb-5 h-px w-40 bg-gradient-to-r from-transparent via-[#c79a42] to-transparent" />
                  <div className="font-serif text-5xl italic tracking-[-0.04em] text-[#a5782f] sm:text-6xl">Кенес</div>
                  <div className="mt-1 flex items-end justify-center gap-4">
                    <span className="font-serif text-8xl font-bold leading-none tracking-[-0.08em] text-[#b78632] drop-shadow-sm sm:text-[9rem]">50</span>
                    <span className="pb-5 font-serif text-4xl italic text-[#a5782f] sm:text-5xl">Жас</span>
                  </div>
                  <div className="mx-auto mt-3 h-px w-44 bg-gradient-to-r from-transparent via-[#c79a42] to-transparent" />
                  <p className="mx-auto mt-6 max-w-sm text-balance text-base leading-7 text-stone-700">{t.familyLine}</p>
                </div>
                <div className="relative z-10 mt-8 rounded-[2rem] border border-[#c79a42]/25 bg-[#071832] p-5 text-center text-white shadow-2xl">
                  <div className="text-sm uppercase tracking-[0.3em] text-amber-100/80">{t.badge}</div>
                  <div className="mt-2 text-lg text-white/75">{t.date} • {t.time}</div>
                  <div className="mt-1 text-sm text-white/55">{t.place}</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="hidden items-center justify-center gap-2 pb-3 text-xs uppercase tracking-[0.25em] text-white/45 sm:flex"
          >
            {t.scroll}
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      <section className="relative bg-[#f6efe4] px-4 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2.5rem] border border-stone-200 bg-white/70 p-6 shadow-2xl shadow-stone-300/30 backdrop-blur-xl sm:p-10 lg:p-14"
          >
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-amber-100">{t.inviteTitle}</div>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-stone-950 sm:text-6xl">50 жас — өмірдің алтын белесі</h2>
              </div>
              <div>
                <p className="text-xl leading-9 text-stone-700">{t.inviteText}</p>
                <div className="mt-8 flex items-center gap-4 rounded-3xl bg-stone-950 p-5 text-white">
                  <Music2 className="h-8 w-8 text-amber-200" />
                  <div>
                    <div className="font-semibold">{lang === "kz" ? "Жылы жүздесу, ақ дастархан, ерекше кеш" : "Тёплая встреча, дастархан и особенный вечер"}</div>
                    <div className="text-sm text-white/55">{t.date} • {t.time} • {t.place}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            <CounterBox value={timeLeft.days} label={t.days} />
            <CounterBox value={timeLeft.hours} label={t.hours} />
            <CounterBox value={timeLeft.minutes} label={t.minutes} />
            <CounterBox value={timeLeft.seconds} label={t.seconds} />
          </div>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2.8rem] border border-stone-200 bg-white shadow-2xl shadow-stone-300/40"
          >
            <div className="bg-[linear-gradient(135deg,#1d1712_0%,#4c3828_100%)] p-8 text-center text-white sm:p-10">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-amber-200 text-stone-950 shadow-xl">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{t.rsvpTitle}</h3>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">{t.rsvpSubtitle}</p>
            </div>

            <form onSubmit={handleRsvpSubmit} className="p-6 sm:p-10">
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">{t.nameLabel}</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder={t.namePlaceholder}
                  className="mt-3 w-full rounded-3xl border border-stone-200 bg-[#f6efe4] px-5 py-4 text-lg outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:bg-white"
                />
              </label>

              <div className="mt-8">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">{t.rsvpQuestion}</div>
                <div className="mt-4 grid gap-3">
                  {t.rsvpOptions.map((option) => {
                    const active = rsvpStatus === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setRsvpStatus(option)}
                        className={`flex items-center gap-4 rounded-3xl border px-5 py-4 text-left text-lg transition ${active ? "border-stone-950 bg-stone-950 text-white shadow-xl" : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"}`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${active ? "border-amber-200 bg-amber-200 text-stone-950" : "border-stone-300"}`}>
                          {active && <Check className="h-4 w-4" />}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" className="mt-8 w-full rounded-3xl bg-[#6f5749] py-7 text-lg font-semibold text-white shadow-xl hover:bg-[#5d493d]">
                {rsvpSent ? t.rsvpSent : t.sendRsvp}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f6efe4] px-4 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2.5rem] bg-stone-950 p-7 text-white shadow-2xl sm:p-9"
          >
            <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{t.programTitle}</h3>
            <div className="mt-8 space-y-4">
              {t.program.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-200 font-semibold text-stone-950">{index + 1}</div>
                  <div className="text-lg text-white/82">{item}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-stone-300/40"
          >
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-stone-950 text-amber-100">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">{t.locationTitle}</h3>
                  <p className="mt-1 text-stone-500">{t.address}</p>
                </div>
              </div>
              <Button asChild className="mt-7 w-full rounded-2xl bg-stone-950 py-6 text-base font-semibold text-white hover:bg-stone-800">
                <a href={TWO_GIS_URL} target="_blank" rel="noreferrer">
                  <Navigation className="mr-2 h-5 w-5" />
                  {t.openMap}
                </a>
              </Button>
            </div>
            <div className="relative h-80 overflow-hidden bg-stone-200">
              <iframe
                title="Карта места проведения"
                src={OSM_MAP_URL}
                className="h-full w-full border-0"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/80 to-transparent" />
              <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-stone-800 shadow-xl backdrop-blur-xl">
                {t.place}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#15120f] px-4 py-10 text-center text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-3xl font-semibold tracking-[-0.05em]">Kenes • 50</div>
          <p className="mt-3 text-white/55">{lang === "kz" ? "Сізді қуанышымыздың куәсі болуға шақырамыз" : "Будем рады разделить этот день вместе с вами"}</p>
        </div>
      </footer>
    </main>
  );
}
