import { useState, useEffect } from 'react'
import './Admin.css'

const PASSWORD = 'sprunya2026'

const SHIFTS_MAP = {
  s1: 'Зміна 1 — Весняний старт (2–15 червня)',
  s2: 'Зміна 2 — Літній вибух (18 червня – 1 липня)',
  s3: 'Зміна 3 — Серпнева пригода (5–18 серпня)',
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pass === PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login__bg-blobs">
        <div className="login-blob lb1" />
        <div className="login-blob lb2" />
      </div>
      <form className={`login-card ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
        <div className="login-card__logo">🌿</div>
        <h1 className="login-card__title">Адмін-панель</h1>
        <p className="login-card__sub">Sprunya Camp · Управління заявками</p>
        <div className="form-group" style={{ marginTop: 24 }}>
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className={`form-input ${error ? 'error' : ''}`}
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false) }}
            placeholder="••••••••••"
            autoFocus
          />
          {error && <span className="form-error">Невірний пароль</span>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
          Увійти
        </button>
        <p style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center' }}>
          Підказка: <code>sprunya2026</code>
        </p>
      </form>
    </div>
  )
}

function StatCard({ icon, value, label, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [registrations, setRegistrations] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('submittedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    load()
  }, [])

  const load = () => {
    const data = JSON.parse(localStorage.getItem('sprunya_registrations') || '[]')
    setRegistrations(data)
  }

  const deleteEntry = (id) => {
    if (!confirm('Видалити цю заявку?')) return
    const updated = registrations.filter(r => r.id !== id)
    localStorage.setItem('sprunya_registrations', JSON.stringify(updated))
    setRegistrations(updated)
    if (selected?.id === id) setSelected(null)
  }

  const clearAll = () => {
    if (!confirm('Видалити ВСІ заявки? Цю дію неможливо скасувати!')) return
    localStorage.removeItem('sprunya_registrations')
    setRegistrations([])
    setSelected(null)
  }

  const exportCSV = () => {
    const headers = ['ID', 'Ім\'я батька', 'Прізвище', 'Телефон', 'Email', 'Ім\'я дитини', 'Вік дитини', 'Зміна', 'Коментар', 'Дата заявки']
    const rows = registrations.map(r => [
      r.id,
      r.parentName, r.parentSurname, r.phone, r.email,
      r.childName, r.childAge,
      SHIFTS_MAP[r.shift] || r.shift,
      (r.comment || '').replace(/,/g, ';'),
      formatDate(r.submittedAt),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sprunya-camp-registrations-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  // Stats
  const statsTotal = registrations.length
  const statsS1 = registrations.filter(r => r.shift === 's1').length
  const statsS2 = registrations.filter(r => r.shift === 's2').length
  const statsS3 = registrations.filter(r => r.shift === 's3').length
  const today = registrations.filter(r => {
    if (!r.submittedAt) return false
    return new Date(r.submittedAt).toDateString() === new Date().toDateString()
  }).length

  // Filter + search + sort
  let filtered = registrations.filter(r => {
    if (filter !== 'all' && r.shift !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        (r.parentName + ' ' + r.parentSurname).toLowerCase().includes(q) ||
        (r.childName || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.phone || '').includes(q)
      )
    }
    return true
  })

  filtered = [...filtered].sort((a, b) => {
    let va = a[sortField] || ''
    let vb = b[sortField] || ''
    if (sortField === 'submittedAt') { va = new Date(va); vb = new Date(vb) }
    if (va < vb) return sortDir === 'asc' ? -1 : 1
    if (va > vb) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}>↕</span>
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">🌿 Sprunya</div>
        <nav className="sidebar__nav">
          <div className="sidebar__nav-item sidebar__nav-item--active">
            <span>📋</span> Заявки
          </div>
        </nav>
        <div className="sidebar__footer">
          <button className="btn btn-outline sidebar__logout" onClick={onLogout}>
            Вийти
          </button>
          <a href="/" className="sidebar__site-link">← На сайт</a>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Панель управління</h1>
            <p className="admin-sub">Всі заявки на реєстрацію · Sprunya Camp 2026</p>
          </div>
          <div className="admin-header__actions">
            <button className="btn btn-outline" onClick={exportCSV} disabled={!registrations.length}>
              ⬇ Експорт CSV
            </button>
            <button className="btn" style={{ background: '#fee2e2', color: '#991b1b', border: 'none' }}
              onClick={clearAll} disabled={!registrations.length}>
              🗑 Очистити
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon="📝" value={statsTotal} label="Всього заявок" accent />
          <StatCard icon="📅" value={today} label="Сьогодні" />
          <StatCard icon="🌱" value={statsS1} label="Зміна 1" />
          <StatCard icon="☀️" value={statsS2} label="Зміна 2" />
          <StatCard icon="🍂" value={statsS3} label="Зміна 3" />
        </div>

        {/* Controls */}
        <div className="table-controls">
          <input
            className="form-input table-search"
            placeholder="🔍 Пошук за ім'ям, email, телефоном..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-tabs">
            {[
              { key: 'all', label: 'Усі' },
              { key: 's1', label: 'Зміна 1' },
              { key: 's2', label: 'Зміна 2' },
              { key: 's3', label: 'Зміна 3' },
            ].map(f => (
              <button key={f.key}
                className={`filter-tab ${filter === f.key ? 'filter-tab--active' : ''}`}
                onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <h3>{registrations.length === 0 ? 'Заявок поки немає' : 'Нічого не знайдено'}</h3>
            <p>{registrations.length === 0
              ? 'Як тільки батьки заповнять форму на сайті — заявки з\'являться тут'
              : 'Спробуйте змінити фільтр або пошуковий запит'}
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="reg-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('parentName')} className="sortable">
                    Батько/мати <SortIcon field="parentName" />
                  </th>
                  <th onClick={() => handleSort('childName')} className="sortable">
                    Дитина <SortIcon field="childName" />
                  </th>
                  <th>Контакти</th>
                  <th onClick={() => handleSort('shift')} className="sortable">
                    Зміна <SortIcon field="shift" />
                  </th>
                  <th onClick={() => handleSort('submittedAt')} className="sortable">
                    Дата заявки <SortIcon field="submittedAt" />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={`reg-row ${selected?.id === r.id ? 'reg-row--selected' : ''}`}
                    onClick={() => setSelected(selected?.id === r.id ? null : r)}>
                    <td>
                      <div className="reg-name">
                        <div className="reg-avatar">{(r.parentName || '?')[0].toUpperCase()}</div>
                        <div>
                          <strong>{r.parentName} {r.parentSurname}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="reg-child">{r.childName}</span>
                      <span className="reg-age">{r.childAge} р.</span>
                    </td>
                    <td>
                      <div className="reg-contact">{r.phone}</div>
                      <div className="reg-contact" style={{ fontSize: '0.8rem' }}>{r.email}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${r.shift === 's2' ? 'gold' : 'green'}`}>
                        {r.shift === 's1' ? 'Зміна 1' : r.shift === 's2' ? 'Зміна 2' : 'Зміна 3'}
                      </span>
                    </td>
                    <td className="reg-date">{formatDate(r.submittedAt)}</td>
                    <td>
                      <button className="delete-btn"
                        onClick={e => { e.stopPropagation(); deleteEntry(r.id) }}
                        title="Видалити">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail panel */}
        {selected && (
          <div className="detail-panel">
            <div className="detail-panel__header">
              <h3>Деталі заявки</h3>
              <button className="detail-panel__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="detail-grid">
              <div className="detail-section">
                <h4>👤 Батько / Мати</h4>
                <div className="detail-row"><span>Ім'я:</span><strong>{selected.parentName} {selected.parentSurname}</strong></div>
                <div className="detail-row"><span>Телефон:</span><strong>{selected.phone}</strong></div>
                <div className="detail-row"><span>Email:</span><strong>{selected.email}</strong></div>
              </div>
              <div className="detail-section">
                <h4>🧒 Дитина</h4>
                <div className="detail-row"><span>Ім'я:</span><strong>{selected.childName}</strong></div>
                <div className="detail-row"><span>Вік:</span><strong>{selected.childAge} років</strong></div>
                <div className="detail-row"><span>Зміна:</span><strong>{SHIFTS_MAP[selected.shift] || selected.shift}</strong></div>
              </div>
              {selected.comment && (
                <div className="detail-section detail-section--full">
                  <h4>💬 Коментар</h4>
                  <p className="detail-comment">{selected.comment}</p>
                </div>
              )}
              <div className="detail-section">
                <h4>📅 Мета</h4>
                <div className="detail-row"><span>Подано:</span><strong>{formatDate(selected.submittedAt)}</strong></div>
                <div className="detail-row"><span>ID:</span><strong style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{selected.id}</strong></div>
              </div>
            </div>
          </div>
        )}

        <p className="admin-footer-note">
          Всього записів у таблиці: <strong>{filtered.length}</strong> з {registrations.length}
        </p>
      </main>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('sc_admin') === '1')

  const login = () => {
    sessionStorage.setItem('sc_admin', '1')
    setAuthed(true)
  }

  const logout = () => {
    sessionStorage.removeItem('sc_admin')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={login} />
  return <Dashboard onLogout={logout} />
}
