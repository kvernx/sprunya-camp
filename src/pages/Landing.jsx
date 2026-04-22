import { useState, useEffect } from 'react'
import './Landing.css'

/* ─── Constants ─── */
const SHIFTS = [
  { id: 's1', name: 'Зміна 1 — Весняний старт',    dates: '2–15 червня 2026',            age: '7–10 років',  price: '9 800 грн',  spots: 12 },
  { id: 's2', name: 'Зміна 2 — Літній вибух',      dates: '18 червня – 1 липня 2026',    age: '10–14 років', price: '10 500 грн', spots: 8  },
  { id: 's3', name: 'Зміна 3 — Серпнева пригода',  dates: '5–18 серпня 2026',            age: '8–14 років',  price: '10 500 грн', spots: 14 },
]

const ACTIVITIES = [
  { emoji: '⚽', title: 'Спорт та команда',   desc: 'Футбол, волейбол, бадмінтон, ранкові зарядки та командні естафети' },
  { emoji: '🎨', title: 'Творчі майстерні',   desc: 'Живопис, ліплення, hand-made, театральна студія та фотографія' },
  { emoji: '🏕️', title: 'Пригоди у природі', desc: 'Походи стежками, орієнтування, нічні квести та кемпінг у наметах' },
  { emoji: '🧠', title: 'Розвиток та науки',  desc: 'STEM-лабораторія, шахи, дебати та кулінарні воркшопи' },
  { emoji: '💧', title: 'Водні розваги',      desc: 'Плавання, водне поло, рафтинг та пляжний волейбол' },
  { emoji: '🎭', title: 'Вечірні шоу',        desc: 'Дискотеки, гала-концерти, КВК та зоряні вечори біля вогнища' },
]

const MARQUEE_ITEMS = ['🌿 Sprunya Camp', '⛺ Незабутнє літо', '🏆 Досягнення щодня', '🤝 Нові друзі', '🌲 Природа та пригоди', '✨ Яскраві спогади']

const GALLERY_ITEMS = [
  { id: 1, label: 'Ранкова зарядка',      emoji: '🌄', hint: 'Фото 1' },
  { id: 2, label: 'Творча майстерня',     emoji: '🎨', hint: 'Фото 2' },
  { id: 3, label: 'Водні пригоди',        emoji: '💧', hint: 'Фото 3' },
  { id: 4, label: 'Командні ігри',        emoji: '⚽', hint: 'Фото 4' },
  { id: 5, label: 'Вечір біля вогнища',   emoji: '🔥', hint: 'Фото 5' },
]

const FAQ_ITEMS = [
  {
    q: 'Скільки тривають зміни і що включено у вартість?',
    a: 'Кожна зміна триває 14 днів. Вартість включає проживання у комфортних будиночках, 5-разове збалансоване харчування, повну програму активностей, всі необхідні матеріали та послуги медичного персоналу.',
  },
  {
    q: 'Який вік підходить для табору?',
    a: 'Ми приймаємо дітей від 7 до 14 років. Кожна зміна має власний віковий діапазон, тому дитина потрапить у групу однолітків — це важливо для комфортного спілкування й розвитку.',
  },
  {
    q: 'Як забезпечується безпека дітей?',
    a: 'У таборі цілодобово чергує медичний персонал. Усі вожаті пройшли 3-місячне навчання та психологічний відбір. Територія огороджена, діти завжди під наглядом досвідчених дорослих.',
  },
  {
    q: 'Чи отримують батьки інформацію про дитину?',
    a: 'Щодня батьки отримують фото і короткий звіт про те, як провела день їхня дитина. Є можливість зв\'язатись по телефону у відведений час. Батьки завжди поінформовані.',
  },
  {
    q: 'Що робити, якщо у дитини алергія або особливі потреби?',
    a: 'Обов\'язково вкажіть це у полі «Коментар» при реєстрації. Ми врахуємо особливості харчування та здоров\'я при плануванні програми. Наш медик відповідає за підтримку кожної дитини.',
  },
  {
    q: 'Коли і як здійснюється оплата?',
    a: 'Після підтвердження заявки ми надішлемо реквізити для оплати. Щоб зберегти місце, необхідно внести передоплату 30% протягом 3 робочих днів. Решта суми сплачується до початку зміни.',
  },
]

/* ─── Storage util ─── */
function saveRegistration(data) {
  const all = JSON.parse(localStorage.getItem('sprunya_registrations') || '[]')
  all.push({ ...data, id: Date.now(), submittedAt: new Date().toISOString() })
  localStorage.setItem('sprunya_registrations', JSON.stringify(all))
}

/* ─── Sub-components ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about',      label: 'Про табір' },
    { href: '#activities', label: 'Активності' },
    { href: '#shifts',     label: 'Зміни' },
    { href: '#gallery',    label: 'Галерея' },
    { href: '#register',   label: 'Реєстрація' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#" className="navbar__logo">
          <span className="navbar__logo-icon">🌿</span>
          <span>Sprunya Camp</span>
        </a>
        <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="navbar__link" onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="#register" className="btn btn-primary navbar__cta" onClick={() => setOpen(false)}>
              Записатись
            </a>
          </li>
        </ul>
        <button className="navbar__burger" onClick={() => setOpen(o => !o)} aria-label="Меню">
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero__blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Реєстрація відкрита · Літо 2026
          </div>
          <h1 className="hero__title">
            Табір, де кожен<br />день — <em>пригода</em>
          </h1>
          <p className="hero__desc">
            Sprunya Camp — місце, де діти від 7 до 14 років відкривають нові таланти,
            знаходять друзів на все життя і повертаються додому іншими.
          </p>
          <div className="hero__actions">
            <a href="#register" className="btn btn-primary hero__cta">
              Записати дитину
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#shifts" className="btn btn-outline">
              Переглянути зміни
            </a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">200+</span>
              <span className="hero__stat-label">щасливих дітей</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">3</span>
              <span className="hero__stat-label">зміни влітку</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">30+</span>
              <span className="hero__stat-label">активностей</span>
            </div>
          </div>
        </div>

        {/* ── Photo collage ── */}
        <div className="hero__visual">
          <div className="hero__photo-grid">
            {/* Tall left photo */}
            <div className="hero__photo">
              {/* Замініть на: <img src="/photos/hero-main.jpg" alt="Табір" /> */}
              <div className="hero__photo-placeholder">
                <span>🏕️</span>
                <p>Головне фото</p>
              </div>
              <div className="hero__photo-badge">Карпати, 1200 м</div>
            </div>
            {/* Top-right */}
            <div className="hero__photo">
              {/* Замініть на: <img src="/photos/hero-2.jpg" alt="Активності" /> */}
              <div className="hero__photo-placeholder">
                <span>⚽</span>
                <p>Спортивні ігри</p>
              </div>
            </div>
            {/* Bottom-right */}
            <div className="hero__photo" style={{ position: 'relative' }}>
              {/* Замініть на: <img src="/photos/hero-3.jpg" alt="Друзі" /> */}
              <div className="hero__photo-placeholder">
                <span>🎨</span>
                <p>Творчість</p>
              </div>
              <div className="hero__photo-stat">
                <strong>7 років</strong>
                <small>працюємо</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span>Гортай вниз</span>
        <div className="hero__scroll-arrow">↓</div>
      </div>
    </section>
  )
}

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__inner">
        <div className="about__media">
          <div className="about__img-wrap">
            <div className="about__img-bg" />
            <div className="about__img-main">
              {/*
                Замініть вміст нижче на реальне фото:
                <img src="/photos/about.jpg" alt="Дети в таборі" />
              */}
              <div className="about__img-placeholder">
                <span>🌲</span>
                <p>Ваше фото тут</p>
              </div>
            </div>
            <div className="about__img-badge">
              <span>💚</span>
              <div>
                <strong>Безпечно та весело</strong>
                <small>Досвідчені вожаті</small>
              </div>
            </div>
          </div>
        </div>

        <div className="about__text">
          <div className="section-label">Про нас</div>
          <h2 className="section-title">
            Де діти ростуть,<br /><em>сміються</em> і дружать
          </h2>
          <p className="about__desc">
            Sprunya Camp — це дитячий табір у мальовничому куточку Карпат, де ми
            організовуємо незабутній відпочинок, розвиток і активне дозвілля для
            дітей різного віку.
          </p>
          <p className="about__desc">
            Кожна зміна — це ретельно продумана програма, де освітні, спортивні та
            творчі активності поєднуються з пригодами на природі. Ми віримо, що
            справжнє дитинство пахне вогнищем, сміється голосно і залишає спогади
            на все життя.
          </p>
          <div className="about__features">
            {[
              { icon: '👨‍⚕️', text: 'Медичний персонал цілодобово' },
              { icon: '🍽️', text: '5-разове збалансоване харчування' },
              { icon: '🛌', text: 'Комфортне проживання у будиночках' },
              { icon: '📱', text: 'Щоденні звіти батькам' },
            ].map(f => (
              <div key={f.icon} className="about__feature">
                <span className="about__feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Activities() {
  return (
    <section id="activities" className="section activities">
      <div className="activities__bg" />
      <div className="container">
        <div className="activities__header">
          <div className="section-label">Програма</div>
          <h2 className="section-title">
            30+ активностей<br />на будь-який <em>смак</em>
          </h2>
          <p className="section-sub">
            Кожна дитина знайде щось своє — від спорту до мистецтва, від науки до пригод.
          </p>
        </div>
        <div className="activities__grid">
          {ACTIVITIES.map(a => (
            <div key={a.title} className="activity-card">
              <div className="activity-card__emoji">{a.emoji}</div>
              <h3 className="activity-card__title">{a.title}</h3>
              <p className="activity-card__desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Shifts() {
  return (
    <section id="shifts" className="section shifts">
      <div className="container">
        <div className="shifts__header">
          <div className="section-label">Зміни</div>
          <h2 className="section-title">
            Оберіть свою<br /><em>зміну</em> на літо 2026
          </h2>
          <p className="section-sub">Кожна зміна — 14 днів незабутніх пригод та нових друзів</p>
        </div>
        <div className="shifts__grid">
          {SHIFTS.map((s, i) => (
            <div key={s.id} className={`shift-card ${i === 1 ? 'shift-card--featured' : ''}`}>
              {i === 1 && <div className="shift-card__popular">🔥 Найпопулярніша</div>}
              <div className="shift-card__num">0{i + 1}</div>
              <h3 className="shift-card__name">{s.name}</h3>
              <div className="shift-card__meta">
                <div className="shift-card__row"><span className="shift-card__icon">📅</span><span>{s.dates}</span></div>
                <div className="shift-card__row"><span className="shift-card__icon">👦</span><span>Вік: {s.age}</span></div>
                <div className="shift-card__row"><span className="shift-card__icon">🪑</span><span>Залишилось місць: <strong>{s.spots}</strong></span></div>
              </div>
              <div className="shift-card__price">{s.price}</div>
              <a href="#register" className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'} shift-card__btn`}>Записатись</a>
            </div>
          ))}
        </div>
        <div className="shifts__note">
          💡 Вартість включає проживання, харчування, програму та всі матеріали
        </div>
      </div>
    </section>
  )
}

function Why() {
  const items = [
    { num: '01', title: 'Дипломовані вожаті',    desc: 'Кожен вожатий проходить 3-місячне навчання та психологічний відбір' },
    { num: '02', title: 'Сучасна інфраструктура',desc: 'Спортивні майданчики, творчі майстерні, басейн і зручні будиночки' },
    { num: '03', title: 'Авторські програми',    desc: 'Ми розробляємо унікальні тематичні зміни, що не повторюються рік у рік' },
    { num: '04', title: 'Онлайн-щоденник',       desc: "Батьки отримують фото та звіти кожного дня — дитина завжди на зв'язку" },
  ]
  return (
    <section className="section why">
      <div className="why__bg" />
      <div className="container why__inner">
        <div className="why__text">
          <div className="section-label">Чому ми</div>
          <h2 className="section-title">Ми турбуємось<br />про <em>кожну</em> дитину</h2>
          <p className="section-sub">За 7 років роботи ми зібрали команду, яка любить дітей і вміє робити їх щасливими.</p>
          <a href="#register" className="btn btn-gold why__cta">Записати дитину зараз</a>
        </div>
        <div className="why__list">
          {items.map(item => (
            <div key={item.num} className="why-item">
              <div className="why-item__num">{item.num}</div>
              <div>
                <h4 className="why-item__title">{item.title}</h4>
                <p className="why-item__desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Gallery ── */
function Gallery() {
  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="gallery__header">
          <div className="gallery__header-text">
            <div className="section-label">Галерея</div>
            <h2 className="section-title">
              Моменти, які<br /><em>запам'ятовуються</em>
            </h2>
          </div>
          <a href="#register" className="gallery__link">
            Переглянути всі фото →
          </a>
        </div>

        <div className="gallery__grid">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className={`gallery__item gallery__item--${item.id}`}>
              {/*
                Замініть placeholder на реальне фото:
                <img src={`/photos/gallery-${item.id}.jpg`} alt={item.label} />
              */}
              <div className="gallery__placeholder">
                <span>{item.emoji}</span>
                <p>{item.hint}</p>
              </div>
              <div className="gallery__overlay">
                <span className="gallery__overlay-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ── */
function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i)

  return (
    <section id="faq" className="section faq">
      <div className="container faq__inner">
        <div className="faq__side">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">
            Часті<br /><em>запитання</em>
          </h2>
          <p className="section-sub faq__side-sub">
            Не знайшли відповідь? Напишіть нам — із задоволенням допоможемо.
          </p>
          <a href="mailto:hello@sprunyacamp.ua" className="btn btn-outline faq__cta">
            Написати нам →
          </a>
        </div>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq__item">
              <button
                className={`faq__question ${openIdx === i ? 'open' : ''}`}
                onClick={() => toggle(i)}
              >
                {item.q}
                <span className="faq__icon">+</span>
              </button>
              <div className={`faq__answer ${openIdx === i ? 'open' : ''}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Registration ── */
function RegistrationForm() {
  const [form, setForm] = useState({
    parentName: '', parentSurname: '', phone: '', email: '',
    childName: '', childAge: '', shift: '', comment: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.parentName.trim())    e.parentName    = "Вкажіть ім'я"
    if (!form.parentSurname.trim()) e.parentSurname = "Вкажіть прізвище"
    if (!form.phone.trim())         e.phone         = "Вкажіть телефон"
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = "Введіть дійсний email"
    if (!form.childName.trim())     e.childName     = "Вкажіть ім'я дитини"
    if (!form.childAge)             e.childAge      = "Вкажіть вік"
    if (!form.shift)                e.shift         = "Оберіть зміну"
    return e
  }

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setTimeout(() => { saveRegistration(form); setSubmitted(true); setLoading(false) }, 800)
  }

  if (submitted) {
    return (
      <section id="register" className="section register">
        <div className="container register__success">
          <div className="success-icon">🎉</div>
          <h2 className="section-title">Заявку прийнято!</h2>
          <p>Дякуємо, {form.parentName}! Ми зв'яжемося з вами протягом 24 годин для підтвердження місця.</p>
          <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ parentName:'', parentSurname:'', phone:'', email:'', childName:'', childAge:'', shift:'', comment:'' }) }}>
            Подати ще одну заявку
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="register" className="section register">
      <div className="register__blob" />
      <div className="container register__inner">
        <div className="register__info">
          <div className="section-label">Реєстрація</div>
          <h2 className="section-title">Готові до<br /><em>пригод?</em></h2>
          <p className="section-sub">Заповніть форму і ми зв'яжемося з вами впродовж одного робочого дня.</p>
          <div className="register__steps">
            {[
              { n: '1', t: 'Заповніть форму' },
              { n: '2', t: 'Отримайте підтвердження' },
              { n: '3', t: 'Оплатіть путівку' },
              { n: '4', t: 'Пакуй валізу! 🎒' },
            ].map(s => (
              <div key={s.n} className="register__step">
                <div className="register__step-n">{s.n}</div>
                <span>{s.t}</span>
              </div>
            ))}
          </div>
        </div>

        <form className="register__form" onSubmit={handleSubmit} noValidate>
          <div className="register__form-title">Дані батьків</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ім'я батька/матері *</label>
              <input className={`form-input ${errors.parentName ? 'error' : ''}`} value={form.parentName}
                onChange={e => set('parentName', e.target.value)} placeholder="Олена" />
              {errors.parentName && <span className="form-error">{errors.parentName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Прізвище *</label>
              <input className={`form-input ${errors.parentSurname ? 'error' : ''}`} value={form.parentSurname}
                onChange={e => set('parentSurname', e.target.value)} placeholder="Коваленко" />
              {errors.parentSurname && <span className="form-error">{errors.parentSurname}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Телефон *</label>
              <input className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone}
                onChange={e => set('phone', e.target.value)} placeholder="+380 67 123 45 67" type="tel" />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} value={form.email}
                onChange={e => set('email', e.target.value)} placeholder="email@example.com" type="email" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="register__form-title" style={{ marginTop: 12 }}>Дані дитини</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ім'я дитини *</label>
              <input className={`form-input ${errors.childName ? 'error' : ''}`} value={form.childName}
                onChange={e => set('childName', e.target.value)} placeholder="Максим" />
              {errors.childName && <span className="form-error">{errors.childName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Вік дитини *</label>
              <select className={`form-select ${errors.childAge ? 'error' : ''}`} value={form.childAge}
                onChange={e => set('childAge', e.target.value)}>
                <option value="">Оберіть вік</option>
                {Array.from({ length: 8 }, (_, i) => i + 7).map(a => (
                  <option key={a} value={a}>{a} років</option>
                ))}
              </select>
              {errors.childAge && <span className="form-error">{errors.childAge}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Бажана зміна *</label>
            <select className={`form-select ${errors.shift ? 'error' : ''}`} value={form.shift}
              onChange={e => set('shift', e.target.value)}>
              <option value="">Оберіть зміну</option>
              {SHIFTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.dates})</option>
              ))}
            </select>
            {errors.shift && <span className="form-error">{errors.shift}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Коментар (необов'язково)</label>
            <textarea className="form-textarea" value={form.comment}
              onChange={e => set('comment', e.target.value)}
              placeholder="Алергії, особливі потреби, запитання..." />
          </div>
          <button type="submit" className="btn btn-primary register__submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Відправляємо...</> : <>Подати заявку <span>→</span></>}
          </button>
          <p className="register__privacy">🔒 Ваші дані захищені і не передаються третім особам</p>
        </form>
      </div>
    </section>
  )
}

/* ── Footer (redesigned) ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">🌿 Sprunya Camp</div>
              <p className="footer__tagline">
                Місце, де кожне літо стає казкою. Карпати, свіже повітря і нові друзі на все життя.
              </p>
              <div className="footer__social">
                <a href="#" className="footer__social-link" aria-label="Instagram">📸</a>
                <a href="#" className="footer__social-link" aria-label="Facebook">👍</a>
                <a href="#" className="footer__social-link" aria-label="TikTok">🎵</a>
                <a href="#" className="footer__social-link" aria-label="YouTube">▶️</a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <div className="footer__col-title">Навігація</div>
              <ul className="footer__nav">
                <li><a href="#about">Про табір</a></li>
                <li><a href="#activities">Активності</a></li>
                <li><a href="#shifts">Зміни та ціни</a></li>
                <li><a href="#gallery">Галерея</a></li>
                <li><a href="#faq">Часті запитання</a></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <div className="footer__col-title">Інформація</div>
              <ul className="footer__nav">
                <li><a href="#">Договір оферти</a></li>
                <li><a href="#">Політика конфіденційності</a></li>
                <li><a href="#">Правила табору</a></li>
                <li><a href="#">Що взяти з собою</a></li>
                <li><a href="#register">Записатись</a></li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <div className="footer__col-title">Контакти</div>
              <div className="footer__contact-list">
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">📧</div>
                  <div className="footer__contact-info">
                    <span className="footer__contact-label">Email</span>
                    <span className="footer__contact-value">hello@sprunyacamp.ua</span>
                  </div>
                </div>
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">📞</div>
                  <div className="footer__contact-info">
                    <span className="footer__contact-label">Телефон</span>
                    <span className="footer__contact-value">+380 67 000 00 00</span>
                  </div>
                </div>
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">📍</div>
                  <div className="footer__contact-info">
                    <span className="footer__contact-label">Адреса</span>
                    <span className="footer__contact-value">Карпати, Івано-Франківська обл.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span className="footer__copyright">© 2026 Sprunya Camp. Усі права захищені.</span>
          <div className="footer__legal">
            <a href="#">Умови використання</a>
            <a href="#">Конфіденційність</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ─── */
export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Activities />
      <Shifts />
      <Why />
      <Gallery />
      <FAQ />
      <RegistrationForm />
      <Footer />
    </>
  )
}