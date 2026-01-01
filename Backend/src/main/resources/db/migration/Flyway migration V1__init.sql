create table if not exists app_user (
  id bigserial primary key,
  email varchar(320) not null unique,
  display_name varchar(200),
  picture_url text,
  role varchar(40) not null default 'STUDENT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists course (
  id bigserial primary key,
  title varchar(200) not null,
  description text,
  instructor_id bigint not null references app_user(id),
  price_cents int not null default 0,
  currency varchar(10) not null default 'INR',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists outbox_event (
  id bigserial primary key,
  aggregate_type varchar(80) not null,
  aggregate_id varchar(120) not null,
  event_type varchar(120) not null,
  payload jsonb not null,
  status varchar(40) not null default 'PENDING',
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists idx_outbox_status_created
  on outbox_event(status, created_at);