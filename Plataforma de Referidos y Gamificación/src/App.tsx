import { useEffect, useMemo, useRef, useState, type ComponentType, type FormEvent } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Coins,
  Copy,
  Download,
  Eye,
  FileBadge,
  FileText,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  History,
  Home,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Newspaper,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TicketCheck,
  Trophy,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  X,
  type LucideProps,
} from "lucide-react";

type Role = "socio" | "admin" | "marketing" | "social" | "contenidos";
type ReferralStatus =
  | "Registrado"
  | "Confirmado"
  | "En seguimiento"
  | "Convertido"
  | "Rechazado"
  | "Expirado";
type RedemptionStatus = "Pendiente" | "Aprobada" | "Entregada" | "Rechazada";
type IconType = ComponentType<LucideProps>;

type Referral = {
  id: number;
  alias: string;
  date: string;
  campaign: string;
  status: ReferralStatus;
  points: number;
  consent: boolean;
};
type Movement = { id: string; date: string; activity: string; detail: string; points: number };
type Redemption = {
  id: number;
  benefit: string;
  cost: number;
  status: RedemptionStatus;
  date: string;
  reason?: string;
};
type Notice = {
  id: number;
  title: string;
  body: string;
  category: string;
  read: boolean;
  date: string;
};
type CommunityPost = {
  id: number;
  alias: string;
  text: string;
  likes: number;
  comments: number;
  reported: boolean;
  hidden: boolean;
};
type AppState = {
  phone: string;
  email: string;
  avatar?: string;
  referrals: Referral[];
  movements: Movement[];
  redemptions: Redemption[];
  notices: Notice[];
  enrolled: string[];
  completedCourses: string[];
  completedGames: string[];
  raffleEntries: string[];
  community: CommunityPost[];
  publishedNews: string[];
  staffCount: number;
  attendanceRecorded: boolean;
  audit: string[];
};

const roleMeta: Record<
  Role,
  { label: string; short: string; icon: IconType; description: string; base: string }
> = {
  socio: {
    label: "Socio",
    short: "Socio",
    icon: UserCheck,
    description: "Referidos, puntos y beneficios",
    base: "socio",
  },
  admin: {
    label: "Administrador",
    short: "Admin",
    icon: ShieldCheck,
    description: "Usuarios, permisos y control",
    base: "admin",
  },
  marketing: {
    label: "Responsable de Marketing",
    short: "Marketing",
    icon: BarChart3,
    description: "Campañas, referidos y canjes",
    base: "marketing",
  },
  social: {
    label: "Responsabilidad Social",
    short: "R. Social",
    icon: HeartHandshake,
    description: "Capacitaciones e impacto",
    base: "social",
  },
  contenidos: {
    label: "Gestor de contenidos",
    short: "Contenidos",
    icon: Newspaper,
    description: "Publicaciones y comunidad",
    base: "contenidos",
  },
};

type NavItem = { key: string; label: string; icon: IconType };
const nav: Record<Role, NavItem[]> = {
  socio: [
    ["inicio", "Inicio", Home],
    ["perfil", "Mi perfil", UserCheck],
    ["referidos", "Referidos", Users],
    ["campanas", "Campañas", Target],
    ["puntos", "Puntos y niveles", Star],
    ["capacitaciones", "Capacitaciones", GraduationCap],
    ["juegos", "Juegos y retos", Gamepad2],
    ["sorteos", "Sorteos", TicketCheck],
    ["beneficios", "Beneficios", Gift],
    ["contenidos", "Contenidos", Newspaper],
    ["notificaciones", "Notificaciones", Bell],
    ["comunidad", "Comunidad", MessageCircle],
    ["bienestar", "Salud y bienestar", Heart],
  ].map(([key, label, icon]) => ({
    key: key as string,
    label: label as string,
    icon: icon as IconType,
  })),
  admin: [
    ["inicio", "Inicio", Home],
    ["usuarios", "Usuarios", Users],
    ["validar", "Validar socios", UserCheck],
    ["roles", "Roles y permisos", ShieldCheck],
    ["parametros", "Parámetros", Settings],
    ["gamificacion", "Gamificación", Trophy],
    ["auditoria", "Auditoría", History],
    ["reportes", "Reportes", BarChart3],
  ].map(([key, label, icon]) => ({
    key: key as string,
    label: label as string,
    icon: icon as IconType,
  })),
  marketing: [
    ["inicio", "Inicio", Home],
    ["campanas", "Campañas", Target],
    ["referidos", "Referidos", Users],
    ["contenidos", "Contenidos", Newspaper],
    ["sorteos", "Sorteos", TicketCheck],
    ["beneficios", "Beneficios y canjes", Gift],
    ["notificaciones", "Notificaciones", Bell],
    ["reportes", "Reportes", BarChart3],
  ].map(([key, label, icon]) => ({
    key: key as string,
    label: label as string,
    icon: icon as IconType,
  })),
  social: [
    ["inicio", "Inicio", Home],
    ["capacitaciones", "Capacitaciones", GraduationCap],
    ["talleres", "Talleres", CalendarDays],
    ["participantes", "Participantes", Users],
    ["certificados", "Certificados", FileBadge],
    ["campanas", "Campañas educativas", Target],
    ["bienestar", "Salud y bienestar", Heart],
    ["reportes", "Impacto social", BarChart3],
  ].map(([key, label, icon]) => ({
    key: key as string,
    label: label as string,
    icon: icon as IconType,
  })),
  contenidos: [
    ["inicio", "Inicio", Home],
    ["publicaciones", "Publicaciones", Newspaper],
    ["materiales", "Materiales educativos", BookOpen],
    ["juegos", "Juegos y retos", Gamepad2],
    ["moderacion", "Moderación", MessageCircle],
  ].map(([key, label, icon]) => ({
    key: key as string,
    label: label as string,
    icon: icon as IconType,
  })),
};

const initialState: AppState = {
  phone: "099 456 7821",
  email: "jose.torres@example.com",
  referrals: [
    {
      id: 1,
      alias: "Ana P.",
      date: "12 jun 2026",
      campaign: "Refiere y gana",
      status: "Convertido",
      points: 250,
      consent: true,
    },
    {
      id: 2,
      alias: "Luis R.",
      date: "08 jun 2026",
      campaign: "Refiere y gana",
      status: "Convertido",
      points: 250,
      consent: true,
    },
    {
      id: 3,
      alias: "Camila V.",
      date: "02 jun 2026",
      campaign: "Impulso local",
      status: "Convertido",
      points: 250,
      consent: true,
    },
    {
      id: 4,
      alias: "Diego S.",
      date: "18 jun 2026",
      campaign: "Refiere y gana",
      status: "En seguimiento",
      points: 0,
      consent: true,
    },
    {
      id: 5,
      alias: "Valeria G.",
      date: "17 jun 2026",
      campaign: "Ahorro joven",
      status: "Confirmado",
      points: 0,
      consent: true,
    },
    {
      id: 6,
      alias: "Mario C.",
      date: "15 jun 2026",
      campaign: "Refiere y gana",
      status: "Registrado",
      points: 0,
      consent: false,
    },
    {
      id: 7,
      alias: "Lucía T.",
      date: "29 may 2026",
      campaign: "Impulso local",
      status: "Rechazado",
      points: 0,
      consent: true,
    },
    {
      id: 8,
      alias: "Pablo N.",
      date: "20 may 2026",
      campaign: "Ahorro joven",
      status: "Expirado",
      points: 0,
      consent: true,
    },
  ],
  movements: [
    {
      id: "ref-1",
      date: "12 jun 2026",
      activity: "Conversión de referido",
      detail: "Ana P. completó la condición",
      points: 250,
    },
    {
      id: "ref-2",
      date: "08 jun 2026",
      activity: "Conversión de referido",
      detail: "Luis R. completó la condición",
      points: 250,
    },
    {
      id: "ref-3",
      date: "02 jun 2026",
      activity: "Conversión de referido",
      detail: "Camila V. completó la condición",
      points: 250,
    },
    {
      id: "course-seed",
      date: "24 may 2026",
      activity: "Capacitación aprobada",
      detail: "Finanzas para el hogar",
      points: 100,
    },
    {
      id: "game-seed",
      date: "18 may 2026",
      activity: "Juego completado",
      detail: "Trivia cooperativa",
      points: 100,
    },
    {
      id: "redeem-seed",
      date: "04 may 2026",
      activity: "Canje aprobado",
      detail: "Cupón de comercios aliados",
      points: -200,
    },
  ],
  redemptions: [
    {
      id: 1,
      benefit: "Cupón comercios aliados",
      cost: 200,
      status: "Entregada",
      date: "04 may 2026",
    },
  ],
  notices: [
    {
      id: 1,
      title: "Nueva capacitación disponible",
      body: "Inscríbete en Seguridad digital y fortalece tus conocimientos.",
      category: "Capacitaciones",
      read: false,
      date: "Hoy, 09:30",
    },
    {
      id: 2,
      title: "Tu referido está en seguimiento",
      body: "Diego S. avanzó a una nueva etapa.",
      category: "Referidos",
      read: false,
      date: "Ayer, 16:20",
    },
    {
      id: 3,
      title: "Sorteo Cooperativismo que inspira",
      body: "Ya puedes revisar tus condiciones de elegibilidad.",
      category: "Sorteos",
      read: true,
      date: "16 jun",
    },
    {
      id: 4,
      title: "Canje entregado",
      body: "Tu cupón de comercios aliados fue entregado.",
      category: "Beneficios",
      read: true,
      date: "04 may",
    },
  ],
  enrolled: [],
  completedCourses: ["Finanzas para el hogar"],
  completedGames: ["Trivia cooperativa"],
  raffleEntries: [],
  publishedNews: [],
  staffCount: 5,
  attendanceRecorded: false,
  community: [
    {
      id: 1,
      alias: "Socio_Andes",
      text: "Compartimos tres hábitos sencillos para organizar el ahorro familiar cada semana.",
      likes: 12,
      comments: 3,
      reported: false,
      hidden: false,
    },
    {
      id: 2,
      alias: "Loja_Ahorra",
      text: "La capacitación de finanzas fue muy clara. Recomiendo completar todos los módulos.",
      likes: 8,
      comments: 2,
      reported: false,
      hidden: false,
    },
  ],
  audit: [
    "Acceso demo iniciado · Socio",
    "Canje previo aprobado · Marketing",
    "Conversión validada · Referido Ana P.",
  ],
};

const campaigns = [
  {
    name: "Refiere y gana",
    type: "Referidos",
    status: "Activa",
    dates: "01 jun – 31 ago 2026",
    progress: 60,
    description: "Invita a nuevas personas y obtén puntos cuando su vinculación sea validada.",
  },
  {
    name: "Ahorro joven",
    type: "Segmentada",
    status: "Activa",
    dates: "15 jun – 30 sep 2026",
    progress: 34,
    description: "Educación y hábitos de ahorro para socios jóvenes.",
  },
  {
    name: "Impulso local",
    type: "Producto",
    status: "Activa",
    dates: "01 may – 31 jul 2026",
    progress: 76,
    description: "Promueve oportunidades para emprendimientos de Loja.",
  },
  {
    name: "Cooperamos juntos",
    type: "Educativa",
    status: "Finalizada",
    dates: "01 mar – 30 abr 2026",
    progress: 100,
    description: "Conoce los principios del cooperativismo.",
  },
];
const courses = [
  {
    name: "Seguridad digital",
    duration: "3 horas",
    mode: "En línea",
    seats: 18,
    points: 100,
    color: "blue",
    description: "Protege tu información y reconoce intentos de fraude.",
  },
  {
    name: "Finanzas para emprender",
    duration: "4 horas",
    mode: "Híbrida",
    seats: 12,
    points: 120,
    color: "green",
    description: "Organiza ingresos, costos y metas de tu negocio.",
  },
  {
    name: "Cooperativismo en acción",
    duration: "2 horas",
    mode: "En línea",
    seats: 24,
    points: 80,
    color: "yellow",
    description: "Descubre cómo funciona nuestra comunidad cooperativa.",
  },
  {
    name: "Liderazgo comunitario",
    duration: "5 horas",
    mode: "Presencial",
    seats: 8,
    points: 150,
    color: "purple",
    description: "Fortalece tus habilidades para generar impacto local.",
  },
];
const benefits = [
  { name: "Botella institucional", category: "Productos", cost: 500, stock: 8, icon: Gift },
  {
    name: "Descuento en supermercado",
    category: "Descuentos",
    cost: 300,
    stock: 22,
    icon: TicketCheck,
  },
  { name: "Kit para notas", category: "Productos", cost: 400, stock: 6, icon: BookOpen },
  {
    name: "Asesoría financiera",
    category: "Servicios",
    cost: 600,
    stock: 12,
    icon: BriefcaseBusiness,
  },
  { name: "Entrada cultural", category: "Experiencias", cost: 350, stock: 14, icon: Sparkles },
  { name: "Taller de cocina local", category: "Experiencias", cost: 700, stock: 4, icon: Heart },
];

function calc(state: AppState) {
  const accounting = state.movements.reduce((sum, m) => sum + m.points, 0);
  const reserved = state.redemptions
    .filter((r) => r.status === "Pendiente")
    .reduce((s, r) => s + r.cost, 0);
  const historical = state.movements.filter((m) => m.points > 0).reduce((s, m) => s + m.points, 0);
  return { accounting, reserved, available: accounting - reserved, historical };
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="icon-button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}
function StatusBadge({ children }: { children: React.ReactNode }) {
  const value = String(children).toLowerCase();
  const tone =
    value.includes("activ") ||
    value.includes("convert") ||
    value.includes("aprobad") ||
    value.includes("entreg") ||
    value.includes("publicad")
      ? "success"
      : value.includes("rechaz") || value.includes("suspend") || value.includes("expir")
        ? "danger"
        : value.includes("pend") ||
            value.includes("seguimiento") ||
            value.includes("borrador") ||
            value.includes("registrado")
          ? "warning"
          : "info";
  return (
    <span className={`badge ${tone}`}>
      <span className="badge-dot" />
      {children}
    </span>
  );
}
function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
function StatCard({
  icon: Icon,
  value,
  label,
  tone = "blue",
}: {
  icon: IconType;
  value: string | number;
  label: string;
  tone?: string;
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={23} />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}
function PageTitle({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: IconType;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div className="title-copy">
        <div className="title-icon">
          <Icon />
        </div>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
function EmptyState({
  title = "No hay resultados",
  text = "Prueba con otros filtros o vuelve más tarde.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="empty">
      <Search />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <IconButton label="Cerrar">
            <X onClick={onClose} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}

function Access({ onEnter }: { onEnter: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role>("socio");
  const [showPassword, setShowPassword] = useState(false);
  const [publicView, setPublicView] = useState<"registro" | "recuperar" | "certificado" | null>(
    null,
  );
  const [publicMessage, setPublicMessage] = useState("");
  const submitPublic = (event: FormEvent, message: string) => {
    event.preventDefault();
    setPublicMessage(message);
  };
  return (
    <>
      <main className="access-page">
        <section className="access-brand">
          <div className="brand-wordmark">
            <span>Cooperativa de Ahorro y Crédito</span>
            <strong>Padre Julián Lorente</strong>
          </div>
          <div className="access-message">
            <span className="eyebrow">Comunidad que crece contigo</span>
            <h1>Participa, aprende y convierte tus logros en beneficios.</h1>
            <p>Una plataforma para fortalecer nuestra comunidad cooperativa desde Loja.</p>
          </div>
          <div className="access-waves" />
        </section>
        <section className="access-panel">
          <div className="demo-tag">
            <Sparkles size={16} /> Prototipo con datos de prueba · Período 2026
          </div>
          <div className="access-form">
            <h2>Bienvenido</h2>
            <p>Elige un perfil para explorar la demostración.</p>
            <div className="role-grid">
              {(Object.keys(roleMeta) as Role[]).map((role) => {
                const RIcon = roleMeta[role].icon;
                return (
                  <button
                    key={role}
                    className={`role-card ${selected === role ? "selected" : ""}`}
                    onClick={() => setSelected(role)}
                  >
                    <span>
                      <RIcon size={20} />
                    </span>
                    <div>
                      <strong>{roleMeta[role].label}</strong>
                      <small>{roleMeta[role].description}</small>
                    </div>
                    {selected === role && <Check size={18} />}
                  </button>
                );
              })}
            </div>
            <div className="field">
              <label htmlFor="demo-user">Usuario o correo</label>
              <div className="field-control">
                <Mail size={18} />
                <input id="demo-user" value={`${selected}@example.com`} readOnly />
              </div>
            </div>
            <div className="field">
              <label htmlFor="demo-pass">Contraseña de demostración</label>
              <div className="field-control">
                <LockKeyhole size={18} />
                <input
                  id="demo-pass"
                  type={showPassword ? "text" : "password"}
                  value="demostracion"
                  readOnly
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar contraseña"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <button className="primary wide" onClick={() => onEnter(selected)}>
              Ingresar a la demostración <ChevronRight size={18} />
            </button>
            <div className="access-links">
              <button
                onClick={() => {
                  setPublicView("registro");
                  setPublicMessage("");
                }}
              >
                Crear cuenta de socio
              </button>
              <button
                onClick={() => {
                  setPublicView("recuperar");
                  setPublicMessage("");
                }}
              >
                Recuperar acceso
              </button>
              <button
                onClick={() => {
                  setPublicView("certificado");
                  setPublicMessage("");
                }}
              >
                Verificar certificado
              </button>
            </div>
            <p className="privacy-note">
              <ShieldCheck size={15} /> No uses datos personales reales. Esta experiencia funciona
              únicamente en tu navegador.
            </p>
          </div>
        </section>
      </main>
      {publicView && (
        <Modal
          title={
            publicView === "registro"
              ? "Registro de socio"
              : publicView === "recuperar"
                ? "Recuperar acceso"
                : "Verificar certificado"
          }
          onClose={() => setPublicView(null)}
        >
          {publicMessage ? (
            <div className="public-result">
              <span className="round-icon">
                <Check />
              </span>
              <h3>Solicitud completada en la demostración</h3>
              <p>{publicMessage}</p>
              <button className="primary wide" onClick={() => setPublicView(null)}>
                Volver al acceso
              </button>
            </div>
          ) : publicView === "registro" ? (
            <form
              onSubmit={(event) =>
                submitPublic(
                  event,
                  "Los datos coinciden con un socio activo del padrón ficticio. La cuenta quedó pendiente de validación local.",
                )
              }
            >
              <div className="form-grid">
                <Field label="Cédula ecuatoriana" value="1104680135" />
                <Field label="Nombres" value="Andrea" />
                <Field label="Apellidos" value="Mora" />
                <Field label="Fecha de nacimiento" type="date" />
                <Field label="Celular" value="099 000 0000" />
                <Field label="Correo" value="andrea.mora@example.com" />
                <Field label="Usuario" value="andrea.mora" />
                <Field label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
              </div>
              <label className="check-row">
                <input type="checkbox" required /> Acepto el texto de muestra para tratamiento de
                datos, identificado como borrador no aprobado.
              </label>
              <div className="form-actions">
                <button type="button" className="secondary" onClick={() => setPublicView(null)}>
                  Cancelar
                </button>
                <button className="primary">Validar y registrar</button>
              </div>
            </form>
          ) : publicView === "recuperar" ? (
            <form
              onSubmit={(event) =>
                submitPublic(
                  event,
                  "Mostramos una confirmación genérica. No se envió ningún correo real; en esta demo puedes continuar al escenario de restablecimiento.",
                )
              }
            >
              <p className="modal-intro">
                Ingresa un correo de prueba. No se enviará ninguna comunicación real.
              </p>
              <Field label="Correo o usuario" value="socio@example.com" />
              <div className="form-actions">
                <button type="button" className="secondary" onClick={() => setPublicView(null)}>
                  Cancelar
                </button>
                <button className="primary">Continuar</button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(event) =>
                submitPublic(
                  event,
                  "Certificado demo válido: José Torres · Finanzas para el hogar · emitido el 24 de mayo de 2026. Documento de demostración.",
                )
              }
            >
              <p className="modal-intro">
                Consulta únicamente certificados semilla y visualiza información mínima.
              </p>
              <Field label="Código de certificado demo" value="PJL-CERT-2026-014" />
              <div className="form-actions">
                <button type="button" className="secondary" onClick={() => setPublicView(null)}>
                  Cancelar
                </button>
                <button className="primary">Verificar código</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}

function Sidebar({
  role,
  page,
  setPage,
  open,
  close,
}: {
  role: Role;
  page: string;
  setPage: (p: string) => void;
  open: boolean;
  close: () => void;
}) {
  return (
    <>
      {open && <button className="drawer-overlay" aria-label="Cerrar menú" onClick={close} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="side-brand">
          <span>Cooperativa</span>
          <strong>
            Padre Julián
            <br />
            Lorente
          </strong>
        </div>
        <nav aria-label="Navegación principal">
          {nav[role].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={page === item.key ? "active" : ""}
                onClick={() => {
                  setPage(item.key);
                  close();
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {page === item.key && <ChevronRight className="nav-arrow" size={16} />}
              </button>
            );
          })}
        </nav>
        <div className="side-foot">
          <span>Período demo</span>
          <strong>Junio 2026</strong>
        </div>
      </aside>
    </>
  );
}

function Header({
  role,
  page,
  onMenu,
  onSwitch,
  unread,
}: {
  role: Role;
  page: string;
  onMenu: () => void;
  onSwitch: () => void;
  unread: number;
}) {
  const item = nav[role].find((n) => n.key === page) || nav[role][0];
  const Icon = item.icon;
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menú">
        <Menu />
      </button>
      <div className="breadcrumb">
        <Icon size={21} />
        <strong>{item.label}</strong>
      </div>
      <div className="top-search">
        <Search size={18} />
        <input aria-label="Buscar en la plataforma" placeholder="Buscar en la plataforma..." />
      </div>
      <IconButton label={`${unread} notificaciones sin leer`}>
        <Bell size={21} />
        {unread > 0 && <span className="notification-dot">{unread}</span>}
      </IconButton>
      <button className="user-menu" onClick={onSwitch}>
        <span className="avatar">JT</span>
        <span>
          <strong>José Torres</strong>
          <small>{roleMeta[role].short}</small>
        </span>
        <ChevronDown size={17} />
      </button>
    </header>
  );
}

function HomePage({ role, state, go }: { role: Role; state: AppState; go: (p: string) => void }) {
  const c = calc(state);
  if (role === "socio") return <SocioHome state={state} go={go} />;
  const metrics: Record<Exclude<Role, "socio">, [string, string | number, IconType, string][]> = {
    admin: [
      ["Usuarios activos", state.staffCount + 1, Users, "blue"],
      ["Socios por validar", 3, UserCheck, "yellow"],
      ["Roles base", 5, ShieldCheck, "green"],
      ["Eventos hoy", state.audit.length, History, "purple"],
    ],
    marketing: [
      ["Referidos", state.referrals.length, Users, "blue"],
      [
        "Conversiones",
        state.referrals.filter((r) => r.status === "Convertido").length,
        UserCheck,
        "green",
      ],
      [
        "Puntos otorgados",
        state.movements.filter((m) => m.points > 0).reduce((a, m) => a + m.points, 0),
        Coins,
        "yellow",
      ],
      ["Campañas activas", 3, Target, "purple"],
    ],
    social: [
      ["Inscritos", state.enrolled.length + 24, Users, "blue"],
      ["Aprobados", state.completedCourses.length + 17, ClipboardCheck, "green"],
      ["Horas de formación", 86, Clock3, "yellow"],
      ["Certificados", state.completedCourses.length + 15, FileBadge, "purple"],
    ],
    contenidos: [
      ["Borradores", 3, FileText, "yellow"],
      ["Publicados", 8 + state.publishedNews.length, Newspaper, "green"],
      ["Programados", 2, Clock3, "blue"],
      [
        "Reportes pendientes",
        state.community.filter((p) => p.reported && !p.hidden).length,
        CircleAlert,
        "purple",
      ],
    ],
  };
  const copy: Record<Exclude<Role, "socio">, { title: string; text: string }> = {
    admin: {
      title: "Control claro para una comunidad confiable",
      text: "Supervisa cuentas, permisos y actividad del prototipo desde un solo lugar.",
    },
    marketing: {
      title: "Conecta campañas con resultados medibles",
      text: "Gestiona referidos, conversiones y beneficios con cifras consistentes.",
    },
    social: {
      title: "Aprendizaje que genera impacto",
      text: "Acompaña la formación, asistencia y certificación de nuestros socios.",
    },
    contenidos: {
      title: "Historias útiles para nuestra comunidad",
      text: "Crea, publica y modera contenido educativo y cercano.",
    },
  };
  return (
    <div className="page">
      <PageTitle
        icon={LayoutDashboard}
        title="Panel principal"
        subtitle={`Vista de ${roleMeta[role].label}`}
      />
      <section className="hero compact">
        <div>
          <span className="eyebrow">Cooperativa Padre Julián Lorente</span>
          <h2>{copy[role].title}</h2>
          <p>{copy[role].text}</p>
        </div>
        <div className="hero-orbit">
          <Activity />
          <span />
        </div>
      </section>
      <div className="stats-grid">
        {metrics[role].map(([label, value, icon, tone]) => (
          <StatCard key={label} label={label} value={value} icon={icon} tone={tone} />
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card chart-card">
          <div className="section-head">
            <div>
              <h2>Actividad del período</h2>
              <p>Datos calculados desde el conjunto de demostración</p>
            </div>
            <StatusBadge>Actualizado</StatusBadge>
          </div>
          <MiniChart />
        </section>
        <section className="card">
          <div className="section-head">
            <div>
              <h2>Accesos rápidos</h2>
              <p>Continúa con una tarea frecuente</p>
            </div>
          </div>
          <div className="quick-list">
            {nav[role].slice(1, 5).map((i) => {
              const I = i.icon;
              return (
                <button key={i.key} onClick={() => go(i.key)}>
                  <span>
                    <I />
                  </span>
                  <strong>{i.label}</strong>
                  <ChevronRight />
                </button>
              );
            })}
          </div>
        </section>
      </div>
      <section className="card">
        <div className="section-head">
          <div>
            <h2>Últimos eventos</h2>
            <p>Actividad visible de la demostración</p>
          </div>
          <button
            className="text-button"
            onClick={() => go(role === "admin" ? "auditoria" : "reportes")}
          >
            Ver todo <ChevronRight />
          </button>
        </div>
        <div className="activity-list">
          {state.audit
            .slice(-4)
            .reverse()
            .map((a, i) => (
              <div key={i}>
                <span className="activity-marker">
                  <Check />
                </span>
                <div>
                  <strong>{a.split(" · ")[0]}</strong>
                  <small>
                    {a.split(" · ")[1] || "Plataforma"} · Hace {i + 1} h
                  </small>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

function MiniChart() {
  const values = [38, 52, 47, 68, 61, 82, 76, 91, 88, 105, 98, 118];
  const max = Math.max(...values);
  return (
    <div className="mini-chart" aria-label="Gráfico de actividad mensual">
      {values.map((v, i) => (
        <div key={i} className="chart-col">
          <span style={{ height: `${(v / max) * 100}%` }} />
          <small>
            {
              ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][
                i
              ]
            }
          </small>
        </div>
      ))}
    </div>
  );
}

function SocioHome({ state, go }: { state: AppState; go: (p: string) => void }) {
  const c = calc(state);
  const unread = state.notices.filter((n) => !n.read).length;
  return (
    <div className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Tu comunidad cooperativa</span>
          <h1>¡Hola, José!</h1>
          <p>Sigue refiriendo, participa en actividades y acumula beneficios.</p>
          <button className="primary" onClick={() => go("referidos")}>
            <Copy size={18} /> Compartir mi código
          </button>
        </div>
        <div className="hero-art">
          <span className="coin c1" />
          <span className="coin c2" />
          <Trophy />
        </div>
      </section>
      <div className="stats-grid">
        <StatCard
          icon={Users}
          value={
            state.referrals.filter((r) =>
              ["Registrado", "Confirmado", "En seguimiento"].includes(r.status),
            ).length
          }
          label="Referidos en proceso"
        />
        <StatCard
          icon={GraduationCap}
          value={courses.length - state.enrolled.length}
          label="Capacitaciones disponibles"
          tone="purple"
        />
        <StatCard icon={Gamepad2} value="3" label="Juegos activos" tone="green" />
        <StatCard
          icon={Gift}
          value={benefits.filter((b) => b.cost <= c.available).length}
          label="Beneficios a tu alcance"
          tone="yellow"
        />
      </div>
      <div className="home-grid">
        <div className="home-main">
          <div className="split-cards">
            <section className="card referral-code">
              <div className="section-head">
                <div>
                  <h2>Tu código de referido</h2>
                  <p>Invita a más personas y gana puntos.</p>
                </div>
                <span className="round-icon">
                  <Users />
                </span>
              </div>
              <strong>PJL-DEMO26</strong>
              <button
                className="secondary"
                onClick={() => navigator.clipboard?.writeText("PJL-DEMO26")}
              >
                <Copy /> Copiar código
              </button>
            </section>
            <section className="card level-card">
              <div>
                <span>Nivel actual</span>
                <h2>Nivel Plata</h2>
                <p>{c.historical.toLocaleString("es-EC")} / 2.000 puntos históricos</p>
                <ProgressBar value={c.historical / 20} />
                <small>Tu nivel se calcula por puntos obtenidos; los canjes no lo reducen.</small>
              </div>
              <Award />
            </section>
          </div>
          <button className="campaign-banner" onClick={() => go("campanas")}>
            <span>
              <small>CAMPAÑA ACTIVA</small>
              <strong>Refiere y gana</strong>
              <em>3 conversiones verificadas</em>
            </span>
            <span>
              Ver campaña <ChevronRight />
            </span>
          </button>
          <section className="card">
            <div className="section-head">
              <div>
                <h2>Accesos rápidos</h2>
                <p>Todo lo que necesitas, a un clic</p>
              </div>
            </div>
            <div className="quick-grid">
              {[
                ["Mi perfil", "perfil", Pencil],
                ["Mis puntos", "puntos", Coins],
                ["Capacitaciones", "capacitaciones", GraduationCap],
                ["Beneficios", "beneficios", Gift],
              ].map(([l, p, I]) => (
                <button key={l as string} onClick={() => go(p as string)}>
                  <I size={22} />
                  <span>{l as string}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
        <aside className="home-aside">
          <section className="card balance-card">
            <span>Disponible</span>
            <strong>{c.available}</strong>
            <small>puntos · {c.reserved} reservados</small>
            <button onClick={() => go("puntos")}>
              Ver movimientos <ChevronRight />
            </button>
          </section>
          <section className="card">
            <div className="section-head">
              <div>
                <h2>Actividad reciente</h2>
                <p>{unread} avisos sin leer</p>
              </div>
              <Bell />
            </div>
            <div className="activity-list">
              {state.notices.slice(0, 4).map((n) => (
                <button key={n.id} onClick={() => go("notificaciones")}>
                  <span className="activity-marker">
                    <Bell />
                  </span>
                  <div>
                    <strong>{n.title}</strong>
                    <small>{n.date}</small>
                  </div>
                  {!n.read && <i />}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ProfilePage({
  state,
  update,
  toast,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  const [tab, setTab] = useState("datos");
  const [phone, setPhone] = useState(state.phone);
  const [email, setEmail] = useState(state.email);
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast("Ingresa un correo válido.");
    update((s) => ({
      ...s,
      phone,
      email,
      audit: [...s.audit, "Perfil actualizado · José Torres"],
    }));
    toast("Tu información fue actualizada.");
  };
  return (
    <div className="page">
      <PageTitle
        icon={UserCheck}
        title="Mi perfil"
        subtitle="Consulta y actualiza tu información personal."
      />
      <div className="profile-layout">
        <aside className="card profile-card">
          <div className="big-avatar">
            JT
            <button aria-label="Cambiar foto">
              <Pencil />
            </button>
          </div>
          <h2>José Torres</h2>
          <StatusBadge>Socio activo</StatusBadge>
          <p>Código PJL-DEMO26</p>
          <hr />
          <span>Miembro desde</span>
          <strong>12 de marzo de 2025</strong>
        </aside>
        <form className="card form-card" onSubmit={save}>
          <div className="tabs">
            {[
              ["datos", "Datos personales", UserCheck],
              ["contacto", "Contacto", Mail],
              ["seguridad", "Seguridad", LockKeyhole],
            ].map(([k, l, I]) => (
              <button
                type="button"
                className={tab === k ? "active" : ""}
                onClick={() => setTab(k as string)}
                key={k as string}
              >
                <I />
                {l as string}
              </button>
            ))}
          </div>
          {tab === "datos" && (
            <div className="form-grid">
              <Field label="Nombres" value="José" readOnly />
              <Field label="Apellidos" value="Torres" readOnly />
              <Field label="Cédula" value="11••••••30" readOnly />
              <Field label="Código de socio" value="SOC-10234" readOnly />
              <Field label="Fecha de nacimiento" value="15 de junio de 1992" readOnly />
              <Field label="Agencia" value="Loja centro" readOnly />
            </div>
          )}
          {tab === "contacto" && (
            <div className="form-grid">
              <Field label="Celular" value={phone} onChange={setPhone} />
              <Field label="Correo" value={email} onChange={setEmail} />
              <div className="info-box">
                <ShieldCheck />
                <span>Solo puedes editar tu teléfono, correo y fotografía en este prototipo.</span>
              </div>
            </div>
          )}
          {tab === "seguridad" && (
            <div className="form-grid">
              <Field label="Nueva contraseña" type="password" placeholder="Mínimo 8 caracteres" />
              <Field
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite la contraseña"
              />
              <div className="info-box">
                <LockKeyhole />
                <span>La demostración valida la coincidencia, pero no almacena contraseñas.</span>
              </div>
            </div>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setPhone(state.phone);
                setEmail(state.email);
              }}
            >
              Cancelar
            </button>
            <button className="primary" type="submit">
              <Check /> Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  readOnly,
  type = "text",
  placeholder,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className={`field-control ${readOnly ? "readonly" : ""}`}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
        />
        {readOnly && <LockKeyhole size={15} />}
      </div>
    </label>
  );
}

function ReferralsPage({
  role,
  state,
  update,
  toast,
}: {
  role: Role;
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  const [invite, setInvite] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [name, setName] = useState("");
  const list =
    filter === "Todos" ? state.referrals : state.referrals.filter((r) => r.status === filter);
  const add = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) return;
    const alias = name
      .trim()
      .split(" ")
      .map((p, i) => (i === 0 ? p : `${p[0]}.`))
      .join(" ");
    update((s) => ({
      ...s,
      referrals: [
        {
          id: Date.now(),
          alias,
          date: "20 jun 2026",
          campaign: "Refiere y gana",
          status: "Registrado",
          points: 0,
          consent: false,
        },
        ...s.referrals,
      ],
      notices: [
        {
          id: Date.now(),
          title: "Referido registrado",
          body: `${alias} fue registrado y tiene el consentimiento pendiente.`,
          category: "Referidos",
          read: false,
          date: "Ahora",
        },
        ...s.notices,
      ],
      audit: [...s.audit, `Referido registrado · ${alias}`],
    }));
    setInvite(false);
    toast("Referido registrado. Consentimiento pendiente.");
  };
  const convert = (id: number) =>
    update((s) => {
      const r = s.referrals.find((x) => x.id === id);
      if (!r || r.status === "Convertido") return s;
      return {
        ...s,
        referrals: s.referrals.map((x) =>
          x.id === id ? { ...x, status: "Convertido", points: 250, consent: true } : x,
        ),
        movements: [
          {
            id: `ref-${id}`,
            date: "20 jun 2026",
            activity: "Conversión de referido",
            detail: `${r.alias} completó la condición`,
            points: 250,
          },
          ...s.movements,
        ],
        notices: [
          {
            id: Date.now(),
            title: "¡Nueva conversión validada!",
            body: `${r.alias} fue convertido. Acreditamos 250 puntos.`,
            category: "Referidos",
            read: false,
            date: "Ahora",
          },
          ...s.notices,
        ],
        audit: [...s.audit, `Conversión validada · ${r.alias}`],
      };
    });
  const confirmConsent = (id: number) => {
    update((s) => ({
      ...s,
      referrals: s.referrals.map((x) =>
        x.id === id ? { ...x, consent: true, status: "Confirmado" } : x,
      ),
      audit: [...s.audit, "Consentimiento confirmado · Referidos"],
    }));
    toast("Consentimiento confirmado. La conversión continúa como una acción separada.");
  };
  const registered = state.referrals.length,
    converted = state.referrals.filter((r) => r.status === "Convertido").length;
  return (
    <div className="page">
      <PageTitle
        icon={Users}
        title={role === "marketing" ? "Gestión de referidos" : "Mis referidos"}
        subtitle={
          role === "marketing"
            ? "Confirma consentimientos y registra conversiones elegibles."
            : "Invita a nuevas personas y consulta su avance sin exponer datos sensibles."
        }
        action={
          role === "socio" ? (
            <button className="primary" onClick={() => setInvite(true)}>
              <UserPlus /> Invitar referido
            </button>
          ) : undefined
        }
      />
      <div className="stats-grid">
        <StatCard icon={Users} value={registered} label="Referidos registrados" />
        <StatCard
          icon={Clock3}
          value={state.referrals.filter((r) => r.status === "En seguimiento").length}
          label="En seguimiento"
          tone="yellow"
        />
        <StatCard icon={UserCheck} value={converted} label="Convertidos" tone="green" />
        <StatCard
          icon={Coins}
          value={converted * 250}
          label="Puntos por conversiones"
          tone="purple"
        />
      </div>
      {role === "socio" && (
        <section className="card code-strip">
          <div>
            <span>Tu código de referido</span>
            <strong>PJL-DEMO26</strong>
          </div>
          <button
            className="secondary"
            onClick={() => {
              navigator.clipboard?.writeText("PJL-DEMO26");
              toast("Código copiado al portapapeles.");
            }}
          >
            <Copy /> Copiar
          </button>
          <button className="primary" onClick={() => setInvite(true)}>
            <UserPlus /> Invitar
          </button>
        </section>
      )}
      <section className="card">
        <div className="filter-row">
          <div className="search-box">
            <Search />
            <input placeholder="Buscar por alias o campaña..." />
          </div>
          <select
            aria-label="Filtrar estado"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Todos</option>
            <option>Registrado</option>
            <option>Confirmado</option>
            <option>En seguimiento</option>
            <option>Convertido</option>
            <option>Rechazado</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Referido</th>
                <th>Fecha</th>
                <th>Campaña</th>
                <th>Consentimiento</th>
                <th>Estado</th>
                <th>Puntos</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td data-label="Referido">
                    <strong>{r.alias}</strong>
                  </td>
                  <td data-label="Fecha">{r.date}</td>
                  <td data-label="Campaña">{r.campaign}</td>
                  <td data-label="Consentimiento">{r.consent ? "Confirmado" : "Pendiente"}</td>
                  <td data-label="Estado">
                    <StatusBadge>{r.status}</StatusBadge>
                  </td>
                  <td data-label="Puntos">{r.points || "—"}</td>
                  <td data-label="Acción">
                    {role === "marketing" && !r.consent && r.status === "Registrado" ? (
                      <button className="table-action" onClick={() => confirmConsent(r.id)}>
                        Confirmar consentimiento
                      </button>
                    ) : role === "marketing" &&
                      r.consent &&
                      ["Confirmado", "En seguimiento"].includes(r.status) ? (
                      <button
                        className="table-action"
                        onClick={() => {
                          convert(r.id);
                          toast("Conversión registrada y puntos acreditados una sola vez.");
                        }}
                      >
                        Convertir
                      </button>
                    ) : (
                      <button
                        className="table-action"
                        onClick={() => toast(`Detalle: ${r.alias} · ${r.status} · ${r.campaign}`)}
                      >
                        Ver detalle
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length && <EmptyState />}
      </section>
      {invite && (
        <Modal title="Invitar nuevo referido" onClose={() => setInvite(false)}>
          <form onSubmit={add}>
            <p className="modal-intro">
              Registra datos mínimos. La persona deberá confirmar su consentimiento antes del
              seguimiento.
            </p>
            <Field label="Nombres" value={name} onChange={setName} />
            <Field label="Correo de ejemplo" value="prospecto@example.com" />
            <label className="field">
              <span>Producto de interés</span>
              <select>
                <option>Cuenta de ahorro</option>
                <option>Ahorro programado</option>
                <option>Educación financiera</option>
              </select>
            </label>
            <label className="check-row">
              <input type="checkbox" required /> Confirmo que tengo autorización para compartir esta
              invitación.
            </label>
            <div className="form-actions">
              <button type="button" className="secondary" onClick={() => setInvite(false)}>
                Cancelar
              </button>
              <button className="primary">Registrar invitación</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function CampaignsPage({ role }: { role: Role }) {
  const [selected, setSelected] = useState<(typeof campaigns)[0] | null>(null);
  return (
    <div className="page">
      <PageTitle
        icon={Target}
        title={role === "marketing" ? "Campañas" : "Campañas vigentes"}
        subtitle={
          role === "marketing"
            ? "Configura segmentos, incentivos y resultados."
            : "Descubre oportunidades para participar y avanzar."
        }
        action={
          role === "marketing" ? (
            <button className="primary">
              <Plus /> Nueva campaña
            </button>
          ) : undefined
        }
      />
      <div className="filters-pills">
        <button className="active">Todas</button>
        <button>Referidos</button>
        <button>Educativas</button>
        <button>Producto</button>
      </div>
      <div className="campaign-grid">
        {campaigns.map((c) => (
          <article className="campaign-card" key={c.name}>
            <div className="campaign-top">
              <span className="round-icon">
                <Target />
              </span>
              <StatusBadge>{c.status}</StatusBadge>
            </div>
            <h2>{c.name}</h2>
            <p>{c.description}</p>
            <div className="meta">
              <CalendarDays /> {c.dates}
            </div>
            <div className="progress-label">
              <span>Avance {role === "marketing" ? "de meta" : "personal"}</span>
              <strong>{c.progress}%</strong>
            </div>
            <ProgressBar value={c.progress} />
            <button className="secondary wide" onClick={() => setSelected(c)}>
              Ver detalle <ChevronRight />
            </button>
          </article>
        ))}
      </div>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <StatusBadge>{selected.status}</StatusBadge>
          <p className="modal-intro">{selected.description}</p>
          <div className="detail-list">
            <div>
              <span>Vigencia</span>
              <strong>{selected.dates}</strong>
            </div>
            <div>
              <span>Condición</span>
              <strong>Conversión validada dentro del período</strong>
            </div>
            <div>
              <span>Incentivo demo</span>
              <strong>250 puntos por conversión</strong>
            </div>
            <div>
              <span>Avance</span>
              <strong>{selected.progress}%</strong>
            </div>
          </div>
          <div className="info-box">
            <CircleAlert />
            <span>La tasa se calcula: convertidos / referidos registrados × 100.</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PointsPage({ state }: { state: AppState }) {
  const c = calc(state);
  const [filter, setFilter] = useState("Todos");
  const rows =
    filter === "Todos"
      ? state.movements
      : state.movements.filter((m) => (filter === "Acreditaciones" ? m.points > 0 : m.points < 0));
  return (
    <div className="page">
      <PageTitle
        icon={Star}
        title="Mis puntos y nivel"
        subtitle="Consulta tu saldo, reservas, movimientos y progreso."
      />
      <div className="points-hero card">
        <div className="medal">
          <Award />
        </div>
        <div>
          <span>Nivel actual</span>
          <h2>Nivel Plata</h2>
          <p>Basado en {c.historical} puntos históricos obtenidos</p>
        </div>
        <div className="points-progress">
          <div>
            <span>Progreso a Oro</span>
            <strong>{c.historical} / 2.000</strong>
          </div>
          <ProgressBar value={c.historical / 20} />
          <small>
            Los canjes reducen el saldo, pero no degradan tu nivel en esta configuración.
          </small>
        </div>
      </div>
      <div className="stats-grid three">
        <StatCard icon={Coins} value={c.available} label="Puntos disponibles" />
        <StatCard icon={LockKeyhole} value={c.reserved} label="Puntos reservados" tone="yellow" />
        <StatCard icon={History} value={c.accounting} label="Saldo contable" tone="green" />
      </div>
      <section className="card">
        <div className="section-head">
          <div>
            <h2>Historial de puntos</h2>
            <p>Cada movimiento conserva su origen</p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>Todos</option>
            <option>Acreditaciones</option>
            <option>Descuentos</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Actividad</th>
                <th>Detalle</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td data-label="Fecha">{m.date}</td>
                  <td data-label="Actividad">
                    <strong>{m.activity}</strong>
                  </td>
                  <td data-label="Detalle">{m.detail}</td>
                  <td data-label="Puntos">
                    <span className={m.points > 0 ? "points-positive" : "points-negative"}>
                      {m.points > 0 ? "+" : ""}
                      {m.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function CoursesPage({
  state,
  update,
  toast,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  const [tab, setTab] = useState("Disponibles");
  const [quiz, setQuiz] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const enroll = (name: string) => {
    update((s) =>
      s.enrolled.includes(name)
        ? s
        : {
            ...s,
            enrolled: [...s.enrolled, name],
            notices: [
              {
                id: Date.now(),
                title: "Inscripción confirmada",
                body: `Ya puedes comenzar ${name}.`,
                category: "Capacitaciones",
                read: false,
                date: "Ahora",
              },
              ...s.notices,
            ],
          },
    );
    toast("Inscripción registrada. Ya puedes abrir el curso.");
    setTab("Mis inscripciones");
  };
  const finish = () => {
    if (!quiz || answer !== "b")
      return toast("Resultado: 50%. Necesitas 70% para aprobar. Te queda un intento.");
    update((s) =>
      s.completedCourses.includes(quiz)
        ? s
        : {
            ...s,
            completedCourses: [...s.completedCourses, quiz],
            enrolled: s.enrolled.filter((x) => x !== quiz),
            movements: [
              {
                id: `course-${quiz}`,
                date: "20 jun 2026",
                activity: "Capacitación aprobada",
                detail: quiz,
                points: 100,
              },
              ...s.movements,
            ],
            notices: [
              {
                id: Date.now(),
                title: "Certificado disponible",
                body: `Aprobaste ${quiz} y recibiste 100 puntos.`,
                category: "Capacitaciones",
                read: false,
                date: "Ahora",
              },
              ...s.notices,
            ],
          },
    );
    toast("Resultado: 100%. Curso aprobado y certificado generado.");
    setQuiz(null);
    setAnswer("");
  };
  const shown =
    tab === "Disponibles"
      ? courses
      : tab === "Mis inscripciones"
        ? courses.filter((c) => state.enrolled.includes(c.name))
        : courses.filter((c) => state.completedCourses.includes(c.name));
  return (
    <div className="page">
      <PageTitle
        icon={GraduationCap}
        title="Capacitaciones"
        subtitle="Aprende a tu ritmo y acredita puntos únicamente al aprobar."
      />
      <div className="stats-grid three">
        <StatCard icon={BookOpen} value={courses.length} label="Cursos disponibles" />
        <StatCard
          icon={Clock3}
          value={state.enrolled.length}
          label="Inscripciones activas"
          tone="yellow"
        />
        <StatCard
          icon={FileBadge}
          value={state.completedCourses.length}
          label="Certificados"
          tone="green"
        />
      </div>
      <div className="tabs page-tabs">
        {["Disponibles", "Mis inscripciones", "Completadas y certificados"].map((t) => (
          <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>
            {t}
          </button>
        ))}
      </div>
      <div className="course-grid">
        {shown.map((c) => (
          <article className="course-card" key={c.name}>
            <div className={`course-cover ${c.color}`}>
              <GraduationCap />
              <span>{c.mode}</span>
            </div>
            <div className="course-body">
              <StatusBadge>
                {state.completedCourses.includes(c.name)
                  ? "Aprobado"
                  : state.enrolled.includes(c.name)
                    ? "En curso"
                    : "Disponible"}
              </StatusBadge>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              <div className="course-meta">
                <span>
                  <Clock3 /> {c.duration}
                </span>
                <span>
                  <Users /> {c.seats} cupos
                </span>
                <span>
                  <Star /> {c.points} pts
                </span>
              </div>
              {state.completedCourses.includes(c.name) ? (
                <button className="secondary wide" onClick={() => window.print()}>
                  <Download /> Imprimir certificado demo
                </button>
              ) : state.enrolled.includes(c.name) ? (
                <button className="primary wide" onClick={() => setQuiz(c.name)}>
                  Continuar y evaluar
                </button>
              ) : (
                <button className="primary wide" onClick={() => enroll(c.name)}>
                  Inscribirme
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!shown.length && (
        <EmptyState
          title="No tienes cursos en esta sección"
          text="Inscríbete en un curso disponible para comenzar."
        />
      )}
      {quiz && (
        <Modal title={`Evaluación · ${quiz}`} onClose={() => setQuiz(null)}>
          <div className="quiz-progress">
            <span>Pregunta 2 de 2</span>
            <strong>Intento 1 de 2</strong>
          </div>
          <ProgressBar value={100} />
          <fieldset className="quiz-options">
            <legend>¿Cuál es la práctica más segura para proteger una cuenta?</legend>
            <label>
              <input type="radio" name="q" value="a" onChange={(e) => setAnswer(e.target.value)} />{" "}
              Usar la misma contraseña en todos los servicios.
            </label>
            <label>
              <input type="radio" name="q" value="b" onChange={(e) => setAnswer(e.target.value)} />{" "}
              Activar verificación en dos pasos y usar claves únicas.
            </label>
            <label>
              <input type="radio" name="q" value="c" onChange={(e) => setAnswer(e.target.value)} />{" "}
              Compartir la clave con una persona de confianza.
            </label>
          </fieldset>
          <div className="form-actions">
            <button className="secondary" onClick={() => setQuiz(null)}>
              Salir
            </button>
            <button className="primary" disabled={!answer} onClick={finish}>
              Enviar evaluación
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function GamesPage({
  state,
  update,
  toast,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [choice, setChoice] = useState("");
  const games = [
    ["Trivia cooperativa", "Trivia", "Pon a prueba tus conocimientos cooperativos.", Trophy],
    [
      "Mitos del ahorro",
      "Verdadero / Falso",
      "Identifica recomendaciones financieras confiables.",
      ShieldCheck,
    ],
    ["Conecta conceptos", "Emparejar", "Relaciona conceptos con sus definiciones.", Gamepad2],
  ] as const;
  const submit = () => {
    if (!playing) return;
    const won = choice === "correct";
    if (won)
      update((s) =>
        s.completedGames.includes(playing)
          ? s
          : {
              ...s,
              completedGames: [...s.completedGames, playing],
              movements: [
                {
                  id: `game-${playing}`,
                  date: "20 jun 2026",
                  activity: "Juego completado",
                  detail: playing,
                  points: 50,
                },
                ...s.movements,
              ],
            },
      );
    toast(
      won
        ? "¡Respuesta correcta! Recompensa acreditada una sola vez."
        : "Respuesta incorrecta. Revisa la explicación e intenta nuevamente.",
    );
    setPlaying(null);
    setChoice("");
  };
  return (
    <div className="page">
      <PageTitle
        icon={Gamepad2}
        title="Juegos y retos"
        subtitle="Aprende jugando, completa objetivos y consulta tus intentos."
      />
      <div className="game-grid">
        {games.map(([name, type, desc, I]) => (
          <article className="card game-card" key={name}>
            <span className="round-icon">
              <I />
            </span>
            <StatusBadge>{type}</StatusBadge>
            <h2>{name}</h2>
            <p>{desc}</p>
            <div className="detail-list compact">
              <div>
                <span>Intentos</span>
                <strong>2 disponibles</strong>
              </div>
              <div>
                <span>Recompensa</span>
                <strong>50 puntos</strong>
              </div>
            </div>
            <button className="primary wide" onClick={() => setPlaying(name)}>
              {state.completedGames.includes(name) ? "Jugar sin recompensa" : "Jugar ahora"}
            </button>
          </article>
        ))}
      </div>
      <section className="card">
        <div className="section-head">
          <div>
            <h2>Reto del mes</h2>
            <p>Completa 2 actividades educativas antes del 30 de junio</p>
          </div>
          <StatusBadge>Activo</StatusBadge>
        </div>
        <div className="progress-label">
          <span>Tu avance</span>
          <strong>1 / 2</strong>
        </div>
        <ProgressBar value={50} />
      </section>
      {playing && (
        <Modal title={playing} onClose={() => setPlaying(null)}>
          <p className="modal-intro">Selecciona la afirmación correcta:</p>
          <fieldset className="quiz-options">
            <legend>¿Qué acción ayuda a construir un hábito de ahorro?</legend>
            <label>
              <input
                type="radio"
                name="game"
                value="wrong"
                onChange={(e) => setChoice(e.target.value)}
              />{" "}
              Ahorrar solo cuando sobra dinero.
            </label>
            <label>
              <input
                type="radio"
                name="game"
                value="correct"
                onChange={(e) => setChoice(e.target.value)}
              />{" "}
              Separar una cantidad definida al recibir ingresos.
            </label>
            <label>
              <input
                type="radio"
                name="game"
                value="wrong2"
                onChange={(e) => setChoice(e.target.value)}
              />{" "}
              No registrar los gastos pequeños.
            </label>
          </fieldset>
          <button className="primary wide" disabled={!choice} onClick={submit}>
            Comprobar respuesta
          </button>
        </Modal>
      )}
    </div>
  );
}

function RafflesPage({
  state,
  update,
  toast,
  role,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
  role: Role;
}) {
  const raffles = [
    {
      name: "Cooperativismo que inspira",
      prize: "Kit tecnológico",
      condition: "1 conversión validada",
      status: "Activo",
      date: "30 jun 2026",
    },
    {
      name: "Impulso lojano",
      prize: "Experiencia cultural",
      condition: "Curso aprobado",
      status: "Activo",
      date: "15 jul 2026",
    },
    {
      name: "Aniversario PJL",
      prize: "Kit institucional",
      condition: "Socio activo",
      status: "Cerrado",
      date: "30 abr 2026",
    },
  ];
  const participate = (name: string) => {
    if (state.raffleEntries.includes(name))
      return toast("Ya tienes una participación para este origen.");
    update((s) => ({ ...s, raffleEntries: [...s.raffleEntries, name] }));
    toast("Participación confirmada sin descontar puntos.");
  };
  return (
    <div className="page">
      <PageTitle
        icon={TicketCheck}
        title={role === "marketing" ? "Gestión de sorteos" : "Sorteos"}
        subtitle={
          role === "marketing"
            ? "Ejecución de demostración sin validez para sorteos reales."
            : "Las participaciones se obtienen por cumplir condiciones; no descuentan puntos."
        }
        action={
          role === "marketing" ? (
            <button className="primary">
              <Plus /> Crear sorteo
            </button>
          ) : undefined
        }
      />
      <div className="raffle-grid">
        {raffles.map((r) => (
          <article className="raffle-card" key={r.name}>
            <div className="raffle-visual">
              <Gift />
              <span>{r.prize}</span>
            </div>
            <div>
              <StatusBadge>{r.status}</StatusBadge>
              <h2>{r.name}</h2>
              <p>
                <CalendarDays /> Sorteo: {r.date}
              </p>
              <p>
                <ClipboardCheck /> Condición: {r.condition}
              </p>
              {role === "socio" ? (
                <button
                  className="primary wide"
                  disabled={r.status === "Cerrado"}
                  onClick={() => participate(r.name)}
                >
                  {state.raffleEntries.includes(r.name) ? "Inscrito" : "Revisar y participar"}
                </button>
              ) : (
                <button
                  className="secondary wide"
                  disabled={r.status === "Cerrado"}
                  onClick={() =>
                    toast("Ejecución simulada confirmada. Resultado persistente en esta sesión.")
                  }
                >
                  Ejecutar simulación
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BenefitsPage({
  state,
  update,
  toast,
  role,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
  role: Role;
}) {
  const [confirm, setConfirm] = useState<(typeof benefits)[0] | null>(null);
  const c = calc(state);
  const request = () => {
    if (!confirm) return;
    if (c.available < confirm.cost) return toast("No tienes saldo disponible suficiente.");
    update((s) => ({
      ...s,
      redemptions: [
        {
          id: Date.now(),
          benefit: confirm.name,
          cost: confirm.cost,
          status: "Pendiente",
          date: "20 jun 2026",
        },
        ...s.redemptions,
      ],
      notices: [
        {
          id: Date.now(),
          title: "Solicitud de canje recibida",
          body: `Reservamos ${confirm.cost} puntos para ${confirm.name}.`,
          category: "Beneficios",
          read: false,
          date: "Ahora",
        },
        ...s.notices,
      ],
    }));
    setConfirm(null);
    toast("Solicitud creada. Los puntos quedaron reservados.");
  };
  const change = (id: number, status: RedemptionStatus) =>
    update((s) => {
      const r = s.redemptions.find((x) => x.id === id);
      if (!r) return s;
      let movements = s.movements;
      if (status === "Aprobada" && !movements.some((m) => m.id === `redeem-${id}`))
        movements = [
          {
            id: `redeem-${id}`,
            date: "20 jun 2026",
            activity: "Canje aprobado",
            detail: r.benefit,
            points: -r.cost,
          },
          ...movements,
        ];
      return {
        ...s,
        redemptions: s.redemptions.map((x) =>
          x.id === id
            ? { ...x, status, reason: status === "Rechazada" ? "Stock no disponible" : x.reason }
            : x,
        ),
        movements,
        notices: [
          {
            id: Date.now(),
            title: `Canje ${status.toLowerCase()}`,
            body: `${r.benefit}: ${status}.`,
            category: "Beneficios",
            read: false,
            date: "Ahora",
          },
          ...s.notices,
        ],
        audit: [...s.audit, `Canje ${status.toLowerCase()} · ${r.benefit}`],
      };
    });
  if (role === "marketing")
    return (
      <div className="page">
        <PageTitle
          icon={Gift}
          title="Beneficios y canjes"
          subtitle="Aprueba, rechaza y registra entregas con impacto inmediato en el saldo."
        />
        <div className="stats-grid three">
          <StatCard
            icon={Clock3}
            value={state.redemptions.filter((r) => r.status === "Pendiente").length}
            label="Pendientes"
            tone="yellow"
          />
          <StatCard
            icon={PackageCheck}
            value={state.redemptions.filter((r) => r.status === "Aprobada").length}
            label="Por entregar"
          />
          <StatCard
            icon={Check}
            value={state.redemptions.filter((r) => r.status === "Entregada").length}
            label="Entregados"
            tone="green"
          />
        </div>
        <section className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Beneficio</th>
                  <th>Costo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {state.redemptions.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Socio">José T.</td>
                    <td data-label="Beneficio">
                      <strong>{r.benefit}</strong>
                    </td>
                    <td data-label="Costo">{r.cost} pts</td>
                    <td data-label="Fecha">{r.date}</td>
                    <td data-label="Estado">
                      <StatusBadge>{r.status}</StatusBadge>
                    </td>
                    <td data-label="Acciones">
                      <div className="table-buttons">
                        {r.status === "Pendiente" && (
                          <>
                            <button onClick={() => change(r.id, "Aprobada")}>Aprobar</button>
                            <button
                              className="danger-link"
                              onClick={() => change(r.id, "Rechazada")}
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {r.status === "Aprobada" && (
                          <button onClick={() => change(r.id, "Entregada")}>
                            Registrar entrega
                          </button>
                        )}
                        {["Entregada", "Rechazada"].includes(r.status) && (
                          <button>Ver detalle</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  return (
    <div className="page">
      <PageTitle
        icon={Gift}
        title="Beneficios"
        subtitle="Canjea tus puntos por productos, servicios y experiencias."
      />
      <div className="balance-strip">
        <div>
          <Coins />
          <span>
            <small>Disponible</small>
            <strong>{c.available} pts</strong>
          </span>
        </div>
        <div>
          <LockKeyhole />
          <span>
            <small>Reservado</small>
            <strong>{c.reserved} pts</strong>
          </span>
        </div>
        <button className="secondary">
          Mis canjes <ChevronRight />
        </button>
      </div>
      <div className="filters-pills">
        <button className="active">Todos</button>
        <button>Descuentos</button>
        <button>Productos</button>
        <button>Servicios</button>
        <button>Experiencias</button>
      </div>
      <div className="benefit-grid">
        {benefits.map((b) => {
          const I = b.icon;
          return (
            <article className="benefit-card" key={b.name}>
              <div className="benefit-visual">
                <I />
                <button aria-label="Añadir a favoritos">
                  <Heart />
                </button>
              </div>
              <StatusBadge>{b.category}</StatusBadge>
              <h2>{b.name}</h2>
              <p>Vigente hasta el 31 de diciembre de 2026.</p>
              <div className="benefit-cost">
                <span>
                  <Star /> {b.cost} pts
                </span>
                <small>{b.stock} disponibles</small>
              </div>
              <button
                className="primary wide"
                disabled={c.available < b.cost}
                onClick={() => setConfirm(b)}
              >
                Solicitar canje
              </button>
            </article>
          );
        })}
      </div>
      {confirm && (
        <Modal title="Confirmar solicitud" onClose={() => setConfirm(null)}>
          <div className="confirm-benefit">
            <span>
              <Gift />
            </span>
            <div>
              <h3>{confirm.name}</h3>
              <p>Se reservarán los puntos hasta que Marketing revise la solicitud.</p>
            </div>
          </div>
          <div className="balance-preview">
            <div>
              <span>Disponible actual</span>
              <strong>{c.available}</strong>
            </div>
            <ChevronRight />
            <div>
              <span>Disponible posterior</span>
              <strong>{c.available - confirm.cost}</strong>
            </div>
          </div>
          <div className="form-actions">
            <button className="secondary" onClick={() => setConfirm(null)}>
              Cancelar
            </button>
            <button className="primary" onClick={request}>
              Confirmar y reservar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function NotificationsPage({
  state,
  update,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
}) {
  const [filter, setFilter] = useState("Todas");
  const list =
    filter === "Todas" ? state.notices : state.notices.filter((n) => n.category === filter);
  const read = (id: number) =>
    update((s) => ({
      ...s,
      notices: s.notices.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  return (
    <div className="page">
      <PageTitle
        icon={Bell}
        title="Mis notificaciones"
        subtitle="Novedades, actividades y beneficios de tu cooperativa."
        action={
          <button
            className="secondary"
            onClick={() =>
              update((s) => ({ ...s, notices: s.notices.map((n) => ({ ...n, read: true })) }))
            }
          >
            <Check /> Marcar todas como leídas
          </button>
        }
      />
      <div className="notice-layout">
        <section>
          <div className="filters-pills">
            {["Todas", "Referidos", "Capacitaciones", "Sorteos", "Beneficios"].map((f) => (
              <button className={filter === f ? "active" : ""} onClick={() => setFilter(f)} key={f}>
                {f}
              </button>
            ))}
          </div>
          <div className="notice-list">
            {list.map((n) => (
              <button key={n.id} className={!n.read ? "unread" : ""} onClick={() => read(n.id)}>
                <span className="notice-icon">
                  <Bell />
                </span>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                  <small>
                    {n.category} · {n.date}
                  </small>
                </div>
                {!n.read && <i />}
              </button>
            ))}
          </div>
        </section>
        <aside className="card preferences">
          <h2>
            <Settings /> Preferencias
          </h2>
          {["Novedades", "Capacitaciones", "Sorteos", "Beneficios y canjes"].map((x) => (
            <label key={x}>
              <span>{x}</span>
              <input type="checkbox" defaultChecked />
            </label>
          ))}
          <label className="locked">
            <span>
              Comunicaciones obligatorias<small>Mensajes operativos de tus solicitudes</small>
            </span>
            <input type="checkbox" checked disabled />
          </label>
        </aside>
      </div>
    </div>
  );
}

function CommunityPage({
  state,
  update,
  toast,
  moderate = false,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
  moderate?: boolean;
}) {
  const [text, setText] = useState("");
  const add = () => {
    if (text.trim().length < 5) return;
    update((s) => ({
      ...s,
      community: [
        {
          id: Date.now(),
          alias: "José_T",
          text: text.trim(),
          likes: 0,
          comments: 0,
          reported: false,
          hidden: false,
        },
        ...s.community,
      ],
    }));
    setText("");
    toast("Publicación compartida con la comunidad demo.");
  };
  const report = (id: number) => {
    update((s) => ({
      ...s,
      community: s.community.map((p) => (p.id === id ? { ...p, reported: true } : p)),
    }));
    toast("Reporte registrado para revisión.");
  };
  const hide = (id: number) => {
    update((s) => ({
      ...s,
      community: s.community.map((p) => (p.id === id ? { ...p, hidden: true } : p)),
      audit: [...s.audit, "Publicación moderada · Comunidad"],
    }));
    toast("Publicación ocultada. Se conservó el motivo local.");
  };
  const list = moderate
    ? state.community.filter((p) => p.reported)
    : state.community.filter((p) => !p.hidden);
  return (
    <div className="page">
      <PageTitle
        icon={MessageCircle}
        title={moderate ? "Moderación de comunidad" : "Comunidad"}
        subtitle={
          moderate
            ? "Revisa contexto y conserva una justificación local."
            : "Comparte ideas con alias y sin información personal innecesaria."
        }
      />
      {!moderate && (
        <section className="card composer">
          <span className="avatar">JT</span>
          <textarea
            placeholder="Comparte una idea útil con la comunidad..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="primary" onClick={add}>
            Publicar
          </button>
        </section>
      )}
      <div className="feed">
        {list.map((p) => (
          <article className="card post" key={p.id}>
            <div className="post-head">
              <span className="avatar">{p.alias.slice(0, 2).toUpperCase()}</span>
              <div>
                <strong>{p.alias}</strong>
                <small>Socio verificado · 20 jun 2026</small>
              </div>
              <MoreHorizontal />
            </div>
            <p>{p.text}</p>
            {p.hidden && (
              <div className="info-box">
                <CircleAlert />
                <span>Oculta por moderación. Motivo: contenido fuera de tema.</span>
              </div>
            )}
            <div className="post-actions">
              <button
                onClick={() =>
                  update((s) => ({
                    ...s,
                    community: s.community.map((x) =>
                      x.id === p.id ? { ...x, likes: x.likes + 1 } : x,
                    ),
                  }))
                }
              >
                <Heart /> {p.likes}
              </button>
              <button>
                <MessageCircle /> {p.comments}
              </button>
              {moderate ? (
                <button className="danger-link" onClick={() => hide(p.id)}>
                  Ocultar con justificación
                </button>
              ) : (
                <button onClick={() => report(p.id)}>
                  <CircleAlert /> {p.reported ? "Reportada" : "Reportar"}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!list.length && (
        <EmptyState
          title="No hay publicaciones pendientes"
          text="Los reportes de la comunidad aparecerán aquí."
        />
      )}
    </div>
  );
}

function ContentPage({
  role,
  state,
  update,
  toast,
}: {
  role: Role;
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  const [title, setTitle] = useState("");
  const items = [
    ["Guía para crear tu fondo de emergencia", "Educación financiera", "Lectura · 6 min"],
    ["Nueva jornada de capacitación en Loja", "Comunicado", "Evento · 20 jun"],
    ["Cinco claves para comprar con planificación", "Consejos", "Lectura · 4 min"],
    ...state.publishedNews.map((x) => [x, "Comunidad", "Publicado hoy"]),
  ];
  if (role === "contenidos" || role === "marketing")
    return (
      <div className="page">
        <PageTitle
          icon={Newspaper}
          title={role === "contenidos" ? "Publicaciones" : "Contenidos promocionales"}
          subtitle="Crea, previsualiza y publica contenido de demostración."
        />
        <section className="card editor">
          <div className="form-grid">
            <Field label="Título" value={title} onChange={setTitle} />
            <label className="field">
              <span>Categoría</span>
              <select>
                <option>Educación financiera</option>
                <option>Comunicado</option>
                <option>Campaña</option>
              </select>
            </label>
            <label className="field full">
              <span>Resumen</span>
              <textarea placeholder="Escribe un resumen claro para los socios..." />
            </label>
            <label className="field full">
              <span>Cuerpo</span>
              <textarea className="large" placeholder="Desarrolla el contenido..." />
            </label>
          </div>
          <div className="form-actions">
            <button className="secondary">Guardar borrador</button>
            <button
              className="primary"
              disabled={!title.trim()}
              onClick={() => {
                update((s) => ({
                  ...s,
                  publishedNews: [title, ...s.publishedNews],
                  audit: [...s.audit, `Publicación creada · ${title}`],
                }));
                toast("Publicación visible para el socio.");
                setTitle("");
              }}
            >
              Publicar ahora
            </button>
          </div>
        </section>
        <ContentGrid items={items} />
      </div>
    );
  return (
    <div className="page">
      <PageTitle
        icon={Newspaper}
        title="Contenidos"
        subtitle="Noticias, comunicados y educación financiera para tu día a día."
      />
      <div className="filter-row">
        <div className="search-box">
          <Search />
          <input placeholder="Buscar contenidos..." />
        </div>
        <select>
          <option>Todas las categorías</option>
          <option>Educación financiera</option>
          <option>Comunicados</option>
        </select>
      </div>
      <ContentGrid items={items} />
    </div>
  );
}
function ContentGrid({ items }: { items: string[][] }) {
  return (
    <div className="content-grid">
      {items.map(([title, cat, meta], i) => (
        <article className="content-card" key={`${title}-${i}`}>
          <div className={`content-visual visual-${i % 3}`}>
            <Newspaper />
          </div>
          <div>
            <StatusBadge>{cat}</StatusBadge>
            <h2>{title}</h2>
            <p>Información práctica creada para acompañar las decisiones de nuestra comunidad.</p>
            <span>{meta}</span>
            <button className="text-button">
              Leer artículo <ChevronRight />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function WellbeingPage() {
  const agreements = [
    [
      "Centro Vital Loja",
      "Orientación preventiva y tarifa preferencial en servicios seleccionados.",
    ],
    ["Óptica Mirador", "Descuento de demostración en evaluación visual y monturas."],
    ["Movimiento Activo", "Acceso preferencial a actividades físicas comunitarias."],
  ];
  return (
    <div className="page">
      <PageTitle
        icon={Heart}
        title="Salud y bienestar"
        subtitle="Convenios e información preventiva, sin recopilar datos de salud."
      />
      <section className="hero wellness">
        <div>
          <span className="eyebrow">Bienestar integral</span>
          <h2>Cuidarte también es parte de crecer juntos</h2>
          <p>Consulta condiciones y contacta directamente al proveedor ficticio.</p>
        </div>
        <HeartHandshake />
      </section>
      <div className="agreement-grid">
        {agreements.map(([name, desc]) => (
          <article className="card" key={name}>
            <span className="round-icon">
              <Heart />
            </span>
            <StatusBadge>Vigente</StatusBadge>
            <h2>{name}</h2>
            <p>{desc}</p>
            <div className="detail-list compact">
              <div>
                <span>Vigencia</span>
                <strong>Hasta 31 dic 2026</strong>
              </div>
              <div>
                <span>Contacto público</span>
                <strong>bienestar@example.com</strong>
              </div>
            </div>
            <button className="secondary wide">Ver condiciones</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminUsers({
  state,
  update,
  toast,
}: {
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const create = (e: FormEvent) => {
    e.preventDefault();
    if (name.length < 3) return;
    update((s) => ({
      ...s,
      staffCount: s.staffCount + 1,
      audit: [...s.audit, `Personal creado · ${name}`],
    }));
    setModal(false);
    setName("");
    toast("Cuenta de personal creada y evento registrado.");
  };
  const people = [
    ["María Andrade", "Administrador", "Activo"],
    ["Carlos Vélez", "Marketing", "Activo"],
    ["Elena Ruiz", "Responsabilidad Social", "Activo"],
    ["Sofía Mora", "Gestor de contenidos", "Activo"],
    ["José Torres", "Socio", "Activo"],
  ];
  return (
    <div className="page">
      <PageTitle
        icon={Users}
        title="Usuarios"
        subtitle="Consulta, crea y cambia estados con trazabilidad visible."
        action={
          <button className="primary" onClick={() => setModal(true)}>
            <UserPlus /> Crear personal
          </button>
        }
      />
      <div className="stats-grid three">
        <StatCard icon={Users} value={state.staffCount + 1} label="Usuarios demo" />
        <StatCard icon={UserCheck} value={state.staffCount + 1} label="Activos" tone="green" />
        <StatCard icon={CircleAlert} value="0" label="Suspendidos" tone="yellow" />
      </div>
      <section className="card">
        <div className="filter-row">
          <div className="search-box">
            <Search />
            <input placeholder="Nombre, identificación o correo..." />
          </div>
          <button
            className="secondary"
            onClick={() =>
              downloadCsv(
                "usuarios.csv",
                "Nombre,Rol,Estado\\n" + people.map((p) => p.join(",")).join("\\n"),
              )
            }
          >
            <Download /> Exportar CSV
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo demo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p, i) => (
                <tr key={p[0]}>
                  <td data-label="Nombre">
                    <strong>{p[0]}</strong>
                  </td>
                  <td data-label="Correo">usuario{i + 1}@example.com</td>
                  <td data-label="Rol">{p[1]}</td>
                  <td data-label="Estado">
                    <StatusBadge>{p[2]}</StatusBadge>
                  </td>
                  <td data-label="Acciones">
                    <button className="table-action">Ver y editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {modal && (
        <Modal title="Crear cuenta de personal" onClose={() => setModal(false)}>
          <form onSubmit={create}>
            <Field label="Nombres y apellidos" value={name} onChange={setName} />
            <Field label="Correo institucional demo" value="personal@example.com" />
            <label className="field">
              <span>Rol</span>
              <select>
                <option>Responsable de Marketing</option>
                <option>Responsabilidad Social</option>
                <option>Gestor de contenidos</option>
              </select>
            </label>
            <label className="field">
              <span>Estado inicial</span>
              <select>
                <option>Activo</option>
                <option>Suspendido</option>
              </select>
            </label>
            <div className="form-actions">
              <button type="button" className="secondary" onClick={() => setModal(false)}>
                Cancelar
              </button>
              <button className="primary">Crear cuenta</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function OperationalPage({
  role,
  page,
  state,
  update,
  toast,
}: {
  role: Role;
  page: string;
  state: AppState;
  update: (f: (s: AppState) => AppState) => void;
  toast: (s: string) => void;
}) {
  if (role === "contenidos" && page === "moderacion")
    return <CommunityPage state={state} update={update} toast={toast} moderate />;
  if (page === "reportes") return <ReportsPage role={role} state={state} />;
  if (role === "admin" && page === "auditoria") return <AuditPage state={state} />;
  const item = nav[role].find((n) => n.key === page)!;
  const Icon = item.icon;
  const descriptions: Record<string, string> = {
    validar: "Revisa solicitudes contra el padrón ficticio y registra una observación.",
    roles: "Configura permisos visuales por módulo y acción para los cinco roles base.",
    parametros: "Gestiona catálogos y transiciones predefinidas del prototipo.",
    gamificacion: "Configura puntos futuros, límites, niveles e insignias.",
    talleres: "Administra cupos, fechas, modalidad y asistencia sin sobrecupo.",
    participantes: "Consulta avance, resultados y asistencia de los participantes.",
    certificados: "Consulta e imprime documentos de demostración para aprobados.",
    materiales: "Organiza archivos locales reutilizables de hasta 10 MB.",
    juegos: "Configura preguntas, intentos, objetivos y recompensas.",
    notificaciones: "Previsualiza plantillas y simula envíos a una audiencia de prueba.",
  };
  const action = () => {
    if (role === "social" && page === "participantes") {
      if (state.attendanceRecorded)
        return toast("La asistencia ya fue registrada; no se duplicaron puntos.");
      update((s) => ({
        ...s,
        attendanceRecorded: true,
        movements: [
          {
            id: "attendance-demo",
            date: "20 jun 2026",
            activity: "Asistencia a taller",
            detail: "Taller comunitario",
            points: 50,
          },
          ...s.movements,
        ],
        audit: [...s.audit, "Asistencia registrada · Taller comunitario"],
      }));
      return toast("Asistencia registrada y puntos acreditados una sola vez.");
    }
    toast("Cambios guardados en la demostración local.");
  };
  const rows =
    page === "roles"
      ? [
          "Socio",
          "Administrador",
          "Responsable de Marketing",
          "Responsabilidad Social",
          "Gestor de contenidos",
        ]
      : page === "validar"
        ? ["Solicitud PJL-204", "Solicitud PJL-205", "Solicitud PJL-206"]
        : page === "talleres"
          ? ["Planificación familiar", "Liderazgo en comunidad"]
          : page === "certificados"
            ? ["Finanzas para el hogar", "Seguridad digital"]
            : page === "materiales"
              ? ["Guía de ahorro.pdf", "Plantilla de presupuesto.pdf", "Video cooperativismo.mp4"]
              : ["Configuración general", "Registro de demostración", "Criterio institucional"];
  return (
    <div className="page">
      <PageTitle
        icon={Icon}
        title={item.label}
        subtitle={descriptions[page] || "Gestiona la información del período de demostración."}
        action={
          <button className="primary" onClick={action}>
            <Plus /> {page === "participantes" ? "Registrar asistencia" : "Nuevo registro"}
          </button>
        }
      />
      <div className="stats-grid three">
        <StatCard icon={Icon} value={rows.length} label="Registros visibles" />
        <StatCard icon={Check} value={Math.max(rows.length - 1, 1)} label="Activos" tone="green" />
        <StatCard icon={Clock3} value="1" label="Pendiente" tone="yellow" />
      </div>
      <section className="card">
        <div className="filter-row">
          <div className="search-box">
            <Search />
            <input placeholder={`Buscar en ${item.label.toLowerCase()}...`} />
          </div>
          <select>
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Pendiente</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Actualización</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r}>
                  <td data-label="Nombre">
                    <strong>{r}</strong>
                  </td>
                  <td data-label="Tipo">{item.label}</td>
                  <td data-label="Actualización">{18 - i} jun 2026</td>
                  <td data-label="Estado">
                    <StatusBadge>{i === rows.length - 1 ? "Pendiente" : "Activo"}</StatusBadge>
                  </td>
                  <td data-label="Acciones">
                    <button className="table-action" onClick={action}>
                      {page === "validar" ? "Revisar" : "Editar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {page === "roles" && (
          <div className="info-box">
            <ShieldCheck />
            <span>
              Estos controles representan permisos visuales. La autorización efectiva requeriría
              servidor en una implementación futura.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

function AuditPage({ state }: { state: AppState }) {
  return (
    <div className="page">
      <PageTitle
        icon={History}
        title="Auditoría"
        subtitle="Consulta de eventos locales; no representa una bitácora segura o inmutable."
        action={
          <button
            className="secondary"
            onClick={() =>
              downloadCsv(
                "auditoria.csv",
                "Evento,Modulo,Resultado\\n" +
                  state.audit.map((x) => `${x},Prototipo,Exitoso`).join("\\n"),
              )
            }
          >
            <Download /> Exportar CSV
          </button>
        }
      />
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Evento</th>
                <th>Módulo</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {state.audit
                .slice()
                .reverse()
                .map((x, i) => (
                  <tr key={i}>
                    <td data-label="Fecha">20 jun 2026 · {10 + i}:15</td>
                    <td data-label="Evento">
                      <strong>{x.split(" · ")[0]}</strong>
                    </td>
                    <td data-label="Módulo">{x.split(" · ")[1] || "Plataforma"}</td>
                    <td data-label="Resultado">
                      <StatusBadge>Exitoso</StatusBadge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
function ReportsPage({ role, state }: { role: Role; state: AppState }) {
  const c = calc(state);
  const data = [
    ["Referidos registrados", state.referrals.length],
    ["Conversiones", state.referrals.filter((r) => r.status === "Convertido").length],
    ["Puntos disponibles", c.available],
    ["Puntos reservados", c.reserved],
    ["Canjes", state.redemptions.length],
  ];
  return (
    <div className="page">
      <PageTitle
        icon={BarChart3}
        title={role === "social" ? "Impacto social" : "Reportes"}
        subtitle={
          role === "social"
            ? "Horas de formación = suma de duraciones completadas por participante."
            : "Indicadores derivados del mismo estado que las tablas."
        }
        action={
          <button
            className="primary"
            onClick={() =>
              downloadCsv(
                "reporte-junio-2026.csv",
                "Indicador,Valor\\n" + data.map((r) => r.join(",")).join("\\n"),
              )
            }
          >
            <Download /> Exportar CSV
          </button>
        }
      />
      <div className="filter-row report-filters">
        <label>
          Desde
          <input type="date" defaultValue="2026-06-01" />
        </label>
        <label>
          Hasta
          <input type="date" defaultValue="2026-06-30" />
        </label>
        <label>
          Tipo
          <select>
            <option>Resumen general</option>
            <option>Referidos</option>
            <option>Puntos y canjes</option>
          </select>
        </label>
        <button className="secondary" onClick={() => window.print()}>
          Imprimir reporte
        </button>
      </div>
      <div className="dashboard-grid">
        <section className="card">
          <div className="section-head">
            <div>
              <h2>Resumen del período</h2>
              <p>Generado: 20 jun 2026 · 10:30</p>
            </div>
          </div>
          <MiniChart />
        </section>
        <section className="card">
          <h2>Detalle</h2>
          <div className="detail-list">
            {data.map(([k, v]) => (
              <div key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
function downloadCsv(name: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [role, setRole] = useState<Role | null>(
    () => (localStorage.getItem("pjl-role") as Role) || null,
  );
  const [page, setPageState] = useState(() => localStorage.getItem("pjl-page") || "inicio");
  const [state, setState] = useState<AppState>(() => {
    try {
      return JSON.parse(localStorage.getItem("pjl-state") || "null") || initialState;
    } catch {
      return initialState;
    }
  });
  const [drawer, setDrawer] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => localStorage.setItem("pjl-state", JSON.stringify(state)), [state]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const setPage = (p: string) => {
    setPageState(p);
    localStorage.setItem("pjl-page", p);
    window.history.replaceState(null, "", `/${roleMeta[role || "socio"].base}/${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const enter = (r: Role) => {
    setRole(r);
    setPageState("inicio");
    localStorage.setItem("pjl-role", r);
    localStorage.setItem("pjl-page", "inicio");
    window.history.replaceState(null, "", `/${r}/inicio`);
  };
  const reset = () => {
    setState(initialState);
    setToast("Datos de prueba restablecidos.");
    setPage("inicio");
  };
  const notify = (s: string) => setToast(s);
  const pageNode = useMemo(() => {
    if (!role) return null;
    if (page === "inicio") return <HomePage role={role} state={state} go={setPage} />;
    if (role === "socio" && page === "perfil")
      return <ProfilePage state={state} update={setState} toast={notify} />;
    if (page === "referidos" && (role === "socio" || role === "marketing"))
      return <ReferralsPage role={role} state={state} update={setState} toast={notify} />;
    if (page === "campanas") return <CampaignsPage role={role} />;
    if (role === "socio" && page === "puntos") return <PointsPage state={state} />;
    if (page === "capacitaciones" && (role === "socio" || role === "social"))
      return <CoursesPage state={state} update={setState} toast={notify} />;
    if (page === "juegos" && (role === "socio" || role === "contenidos"))
      return role === "socio" ? (
        <GamesPage state={state} update={setState} toast={notify} />
      ) : (
        <OperationalPage role={role} page={page} state={state} update={setState} toast={notify} />
      );
    if (page === "sorteos")
      return <RafflesPage state={state} update={setState} toast={notify} role={role} />;
    if (page === "beneficios" && (role === "socio" || role === "marketing"))
      return <BenefitsPage state={state} update={setState} toast={notify} role={role} />;
    if (page === "notificaciones")
      return role === "socio" ? (
        <NotificationsPage state={state} update={setState} />
      ) : (
        <OperationalPage role={role} page={page} state={state} update={setState} toast={notify} />
      );
    if (
      (page === "contenidos" && ["socio", "marketing"].includes(role)) ||
      page === "publicaciones"
    )
      return <ContentPage role={role} state={state} update={setState} toast={notify} />;
    if (role === "socio" && page === "comunidad")
      return <CommunityPage state={state} update={setState} toast={notify} />;
    if (page === "bienestar") return <WellbeingPage />;
    if (role === "admin" && page === "usuarios")
      return <AdminUsers state={state} update={setState} toast={notify} />;
    return (
      <OperationalPage role={role} page={page} state={state} update={setState} toast={notify} />
    );
  }, [role, page, state]);
  if (!role) return <Access onEnter={enter} />;
  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        page={page}
        setPage={setPage}
        open={drawer}
        close={() => setDrawer(false)}
      />
      <div className="app-main">
        <Header
          role={role}
          page={page}
          onMenu={() => setDrawer(true)}
          onSwitch={() => setRoleOpen(!roleOpen)}
          unread={state.notices.filter((n) => !n.read).length}
        />
        {roleOpen && (
          <div className="role-popover">
            <div>
              <strong>Cambiar perfil demo</strong>
              <span>Los datos compartidos se conservan</span>
            </div>
            {(Object.keys(roleMeta) as Role[]).map((r) => {
              const I = roleMeta[r].icon;
              return (
                <button
                  key={r}
                  className={role === r ? "active" : ""}
                  onClick={() => {
                    enter(r);
                    setRoleOpen(false);
                  }}
                >
                  <I />
                  {roleMeta[r].label}
                  {role === r && <Check />}
                </button>
              );
            })}
            <hr />
            <button onClick={reset}>
              <History /> Restablecer datos de prueba
            </button>
            <button
              onClick={() => {
                setRole(null);
                localStorage.removeItem("pjl-role");
              }}
            >
              <LogOut /> Salir al acceso
            </button>
          </div>
        )}
        <div className="content">{pageNode}</div>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check />
          <span>{toast}</span>
          <button onClick={() => setToast("")}>
            <X />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
