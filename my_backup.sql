--
-- PostgreSQL database dump
--

\restrict z6IslMq7fc06Iz6P9cZ6VA5qEguuKCssOuGD9JeWN0GVeehBJwvigaD8WMXasBw

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: audit_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_entries (
    id text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    author text NOT NULL,
    action text NOT NULL,
    comment text NOT NULL,
    rating integer,
    "isEdited" boolean DEFAULT false NOT NULL,
    "editedAt" timestamp(3) without time zone,
    "incidentId" text NOT NULL
);


ALTER TABLE public.audit_entries OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id text NOT NULL,
    code integer NOT NULL,
    name text NOT NULL,
    section text DEFAULT 'N/A'::text NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: incident_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incident_types (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.incident_types OWNER TO postgres;

--
-- Name: incidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidents (
    id text NOT NULL,
    "shiftDate" timestamp(3) without time zone NOT NULL,
    "jobTitle" text NOT NULL,
    description text NOT NULL,
    priority text NOT NULL,
    status text NOT NULL,
    location text,
    "ipAddress" text,
    "jobFrom" text,
    "reportedOn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isTypeLocked" boolean,
    "isPriorityLocked" boolean,
    "affectedTicketNo" text,
    rating integer,
    "telecomTasks" text[],
    "assignedTeam" text DEFAULT 'C&IT'::text NOT NULL,
    "etlTasks" text[],
    "incidentTypeId" text NOT NULL,
    "requestorId" text NOT NULL,
    "affectedUserId" text
);


ALTER TABLE public.incidents OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    role text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    "ticketNo" text NOT NULL,
    "essUserId" text,
    designation text,
    "contactNo" text,
    "emailId" text,
    "emailIdNic" text,
    "sailPNo" text,
    "passwordLastChanged" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "departmentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a94d3520-5c31-4b9f-a463-bad004ee854e	a2b7a5a2299c2f95abcbf234e203c6b419d269e74295aa5143303677418cd8d6	2025-08-17 14:39:59.052936+00	20250816234028_init	\N	\N	2025-08-17 14:39:58.5608+00	1
906bd1f2-9e6a-4a76-86c6-b40dbfa28cf8	98b390f9770a66257173b179183d903abb10e497221c845c2b6425cb9db5db55	2025-08-17 14:39:59.630929+00	20250817104411_init	\N	\N	2025-08-17 14:39:59.220092+00	1
9fee7e2c-9cce-4bf7-ad7a-247eb89189c1	a53d681ff30de927a8d48b2d8393a8a90299c6920a9206f99504360d4acb8e91	2025-08-17 14:40:00.192992+00	20250817110325_add_optional_designation	\N	\N	2025-08-17 14:39:59.792224+00	1
596ba7ed-9080-45b9-ae08-524d9397bf02	3dabfda4b022c5a82b02d3863f3251bd3676610168ae8383e1a21074aa7b1237	2025-08-17 14:40:00.750057+00	20250817111454_make_department_optional	\N	\N	2025-08-17 14:40:00.351469+00	1
52adaf51-58a3-466f-9ad7-a6ef1933b6f7	7364dfe84a4f506409eb4167ccc54058cba9f93a582a0551d1d93891f1124dd2	2025-08-26 11:45:06.079266+00	20250826114505_add_affected_user	\N	\N	2025-08-26 11:45:05.566527+00	1
95c5162e-85b5-4522-9b62-3d2bbb8855a0	6f33f0ab66d25a3c6ad73df62ebaa1964b2d981b38fe660bb2e61e4da6d911f9	2025-08-26 12:43:28.448319+00	20250826124327_add_default_to_department_section	\N	\N	2025-08-26 12:43:28.036596+00	1
5d8d5e8d-bc02-4363-9101-550b9aac2e67	427f1dfdaa93bfc81d57f7b2208e6f8a96444f5ce097f03ae6b5db58d044729e	2025-08-26 13:05:44.9374+00	20250826130543_add_default_to_department_section	\N	\N	2025-08-26 13:05:44.453799+00	1
\.


--
-- Data for Name: audit_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_entries (id, "timestamp", author, action, comment, rating, "isEdited", "editedAt", "incidentId") FROM stdin;
cmespk28j0000p8p8r81n1bq8	2025-08-26 15:35:42.082	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250826205902-8C24
cmespkli50001p8p8fxn8a9k3	2025-08-26 15:36:07.13	GOUTAM DEBNATH	Action Taken	Informed to Network team.	\N	f	\N	20250826205902-8C24
cmetziwz80000p8zghjqocr9q	2025-08-27 13:02:31.021	Network Vendor	Action Taken	Attended the job and found OFC cable cut.	\N	f	\N	20250826205902-8C24
cmf2hp2wq0000p8ck7ghwbaxn	2025-09-02 11:53:21.113	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at punabad.	\N	t	2025-09-02 11:53:42.307	20250826205902-8C24
cmf2iadjn0001p8ckyuggfsk3	2025-09-02 12:09:54.7	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at punabad.	\N	f	\N	20250826205902-8C24
cmf2jvqcj0003p8ckdbdozggm	2025-09-02 12:54:30.687	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at punabad.	\N	f	\N	20250826205902-8C24
cmf2k5d4g0001p8jo2ys2eq7f	2025-09-02 13:02:00.11	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250902183024-9885
cmf2k5zqb0003p8jo6is1irs2	2025-09-02 13:02:29.408	GOUTAM DEBNATH	Action Taken	Inform to network group.	\N	f	\N	20250902183024-9885
cmf2k83yw0005p8jomsfrh82o	2025-09-02 13:04:08.214	Network Vendor	Action Taken	Attended the job, found ofc cable cut.	\N	f	\N	20250902183024-9885
cmf2kaxmn0007p8joniq81xj9	2025-09-02 13:06:19.965	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut ay punabad.	\N	f	\N	20250902183024-9885
cmf2l5lh70009p8jora3fde0v	2025-09-02 13:30:10.553	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at punabad.	\N	f	\N	20250902183024-9885
cmf2lsav40001p8swlbc0ft6v	2025-09-02 13:47:49.878	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250902191632-C070
cmf2ltl1h0003p8swwnag9848	2025-09-02 13:48:49.73	GOUTAM DEBNATH	Action Taken	Informed to network team.	\N	f	\N	20250902191632-C070
cmf2lvmyl0005p8swmqn1rayz	2025-09-02 13:50:25.531	Network Vendor	Action Taken	Attended the job and found ofc cable cut.	\N	f	\N	20250902191632-C070
cmf2lx1x40007p8swvcd5bf0b	2025-09-02 13:51:31.574	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at BOF.	\N	f	\N	20250902191632-C070
cmf2p0vmm0001p8po82rqmdxu	2025-09-02 15:18:28.892	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at BOF.	\N	f	\N	20250902191632-C070
cmf2pmowt0003p8poa9z754w7	2025-09-02 15:35:26.619	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at punabad.	\N	f	\N	20250902191632-C070
cmf2ppleq0005p8powb5zbane	2025-09-02 15:37:42.048	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250902210646-B7E4
cmf2pq8z10007p8poau7u1qw2	2025-09-02 15:38:12.587	GOUTAM DEBNATH	Action Taken	Informed to network group.	\N	f	\N	20250902210646-B7E4
cmf2pqttm0009p8poesax61p3	2025-09-02 15:38:39.608	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- UTP Cable replacement\n\n---\nUTP cable to replace.	\N	f	\N	20250902210646-B7E4
cmf2qw4m50001p8hox7n875r5	2025-09-02 16:10:46.491	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nofc cable cut.	\N	f	\N	20250902210646-B7E4
cmf2rbes40001p8e4qbyshvlm	2025-09-02 16:22:39.506	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nofc cable cut.	\N	f	\N	20250902210646-B7E4
cmf41iqzq0001p89kvz3g43vs	2025-09-03 13:56:04.261	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250903192233-E4F9
cmf41jixz0003p89krrscy2fw	2025-09-03 13:56:40.485	GOUTAM DEBNATH	Action Taken	Informed to network group.	\N	f	\N	20250903192233-E4F9
cmf41ktnq0005p89kmv7tl1kf	2025-09-03 13:57:41.029	Network Vendor	Action Taken	Visited the site and found the ofc cable cut.	\N	f	\N	20250903192233-E4F9
cmf41neoz0007p89k4snr6odi	2025-09-03 13:59:41.602	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOFC cable cut at punabad.	\N	f	\N	20250903192233-E4F9
cmf4c3jwi0001p8h48850q2vl	2025-09-03 18:52:11.007	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250903002015-CE78
cmf4c44ld0003p8h4z9gukgk7	2025-09-03 18:52:37.824	GOUTAM DEBNATH	Action Taken	Informed to network team.	\N	f	\N	20250903002015-CE78
cmf4c6ftp0005p8h4ezf2rfa5	2025-09-03 18:54:25.691	Network Vendor	Action Taken	Attended the job but found ofc cable cut.	\N	f	\N	20250903002015-CE78
cmf4c7zv10007p8h4qvt0qr8x	2025-09-03 18:55:38.315	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nOfc cable cut at punabad.	\N	f	\N	20250903002015-CE78
cmf4cgloy0009p8h4t7ve0eop	2025-09-03 19:02:19.852	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250903003016-0A3C
cmf4ch3dt000bp8h4tz6di8uy	2025-09-03 19:02:42.779	GOUTAM DEBNATH	Action Taken	Informed to network group.	\N	f	\N	20250903003016-0A3C
cmf4ci45q000dp8h4yz1awjyp	2025-09-03 19:03:30.443	Network Vendor	Action Taken	attended the job found modem down.	\N	f	\N	20250903003016-0A3C
cmf4dljg5000fp8h4gt9makt2	2025-09-03 19:34:09.842	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250903010241-C0D9
cmf6eryfu0001p8m4leyqht72	2025-09-05 05:42:41.171	Telecom User	Action Taken	modem changed.	\N	f	\N	20250903002015-CE78
cmf7rs2iy0001p8mwimbi0xmq	2025-09-06 04:34:27.65	Telecom User	Action Taken	Now it is working fine.	\N	f	\N	20250903002015-CE78
cmf7rsqlt0003p8mwvzkobgcu	2025-09-06 04:34:58.863	Telecom User	Resolved	the issue is resolved.	5	f	\N	20250903002015-CE78
cmf7rvxru0005p8mwyi6vyom5	2025-09-06 04:37:28.12	Standard User	re_open	The issue reappears.	\N	f	\N	20250903002015-CE78
cmf9c977o0001p86c2fxnobak	2025-09-07 06:55:25.374	GOUTAM DEBNATH	Action Taken	Let telecom look into it.	\N	f	\N	20250903002015-CE78
cmf9sh90s0001p89cl1ufhwpc	2025-09-07 14:29:34.825	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250907192556-1C1F
cmf9shsgt0003p89c8lehhyc6	2025-09-07 14:30:00.027	GOUTAM DEBNATH	Action Taken	Informed to network team.	\N	f	\N	20250907192556-1C1F
cmf9si6ac0005p89cz3v5aesp	2025-09-07 14:30:17.939	GOUTAM DEBNATH	Priority Changed	Priority changed to "Medium".\n---\nAs per SLA.	\N	f	\N	20250907192556-1C1F
cmf9utgqq0007p89cd4p38xwp	2025-09-07 15:35:03.934	Network Vendor	Action Taken	attended the job but found ofc cble cut.	\N	f	\N	20250907192556-1C1F
cmf9xye2k0001p8ponlids0q2	2025-09-07 17:02:52.602	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nUser has re-opened the incident. Hence pls check why he is not satisfied with your resolution.	\N	f	\N	20250903002015-CE78
cmfb33tfv0001p86gpcsvt0qa	2025-09-08 12:14:50.056	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250908173957-9111
cmfb34jff0003p86g9nqk8oz4	2025-09-08 12:15:23.737	GOUTAM DEBNATH	Action Taken	Informed to network team.	\N	f	\N	20250908173957-9111
cmfb34tdx0005p86g3gssye9i	2025-09-08 12:15:36.644	GOUTAM DEBNATH	Priority Changed	Priority changed to "Low".\n---\nAs per SLA.	\N	f	\N	20250908173957-9111
cmfb35um80007p86g0ji6454g	2025-09-08 12:16:24.893	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250908173653-7969
cmfb36nnl0009p86gidv8voyo	2025-09-08 12:17:02.527	GOUTAM DEBNATH	Action Taken	Pls contact with Mr Pawan kumar.	\N	f	\N	20250908173653-7969
cmfb38mpx000bp86gluededng	2025-09-08 12:18:34.626	GOUTAM DEBNATH	Priority Changed	Priority changed to "Low".\n---\nAs per SLA.	\N	f	\N	20250908173653-7969
cmfb3dsj1000dp86gx6ydkne6	2025-09-08 12:22:35.435	Network Vendor	Action Taken	Visited the site, MC needs to change.	\N	f	\N	20250908173957-9111
cmfb3eyg6000fp86gmsr212t0	2025-09-08 12:23:29.765	Biometric Vendor	Action Taken	Replaced the defective machine.	\N	f	\N	20250908173653-7969
cmfb4tnox000hp86gmeqr0s9t	2025-09-08 13:02:55.277	Network Vendor	Action Taken	We have no spare MC to replace.	\N	f	\N	20250908173957-9111
cmfb4vp6e000jp86gkirm1yxv	2025-09-08 13:04:30.516	Biometric Vendor	Action Taken	Tested that the new M/C is working properly.	\N	f	\N	20250908173653-7969
cmfb4z6wt000lp86gfjd20s24	2025-09-08 13:07:13.466	GOUTAM DEBNATH	Action Taken	Okay we need to refer then to Telecom.	\N	f	\N	20250908173957-9111
cmfb4znf7000np86ga9s965zq	2025-09-08 13:07:34.864	GOUTAM DEBNATH	Action Taken	Referred to Telecom with the following tasks:\n- Media Converter (MC) issue\n\n---\nMC to replace.	\N	f	\N	20250908173957-9111
cmfb536pz000pp86g4h1ckq4w	2025-09-08 13:10:19.844	GOUTAM DEBNATH	Resolved	The issue has resolved.	5	f	\N	20250908173653-7969
cmfc66nqa0001p874xlujg7ks	2025-09-09 06:28:47.644	GOUTAM DEBNATH	Action Taken	Call accepted.\n	\N	f	\N	20250908115834-3533
cmfc678sk0003p874o5bvt4v8	2025-09-09 06:29:14.946	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nNetwork related issue.	\N	f	\N	20250908115834-3533
cmfc6mx6x0005p874ovq6ahil	2025-09-09 06:41:26.404	GOUTAM DEBNATH	Action Taken	Network related issue.	\N	f	\N	20250908115834-3533
cmfc6sxxa0007p874gm6z8884	2025-09-09 06:46:07.292	Network Vendor	Action Taken	Attended the job, found OS related issue.	\N	f	\N	20250908115834-3533
cmfc8qke90009p8747eajoqar	2025-09-09 07:40:15.666	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250908115834-3533
cmfc8rluy000bp874l7d2bym4	2025-09-09 07:41:04.231	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nPC related issue.	\N	f	\N	20250908115834-3533
cmfcitgi80001p8kcx4ho6qk7	2025-09-09 12:22:26.766	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250909175118-F078
cmfco1m6p0005p8kcbbb7zjns	2025-09-09 14:48:45.454	Network Vendor	Action Taken	Attended the job and found lan card of the PC has problem.	\N	f	\N	20250909175118-F078
cmfciv1740003p8kcrnf51tvt	2025-09-09 12:23:40.238	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nTalked with user and it seems network issue.	\N	t	2025-09-09 14:49:57.047	20250909175118-F078
cmfco3my90007p8kck2t8qz5c	2025-09-09 14:50:19.759	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250909175118-F078
cmfcrkbvk0009p8kcccfzfe5x	2025-09-09 16:27:17.406	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nSince PC hardware related issue hence refering to ETL.	\N	f	\N	20250909175118-F078
cmfcy98ze000bp8kc5qhu63x1	2025-09-09 19:34:37.75	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250909175118-F078
cmfcy9u8v000dp8kcbt0qawjs	2025-09-09 19:35:05.309	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nnetwork issue.	\N	f	\N	20250909175118-F078
cmfcya2wv000fp8kc5h4ao5uo	2025-09-09 19:35:16.541	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250909175118-F078
cmfcyajz7000hp8kcl492ypa2	2025-09-09 19:35:38.657	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nPC related issue.	\N	f	\N	20250909175118-F078
cmfcyj8xs000jp8kckk14br8v	2025-09-09 19:42:24.251	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250909175118-F078
cmfcykdea000lp8kczipm4qb4	2025-09-09 19:43:16.687	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nnetwork incident.	\N	f	\N	20250909175118-F078
cmfcykkej000np8kcvff68emq	2025-09-09 19:43:25.769	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250909175118-F078
cmfcyl2wd000pp8kcmhk2r3i3	2025-09-09 19:43:49.739	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nPC related issue.	\N	f	\N	20250909175118-F078
cmfdwrd2f0001p8q8gyshpnm6	2025-09-10 11:40:29.796	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250910170936-FDB9
cmfdwt2en0003p8q8hgtr44wu	2025-09-10 11:41:49.293	GOUTAM DEBNATH	Action Taken	Talked with user and it seems that he has network related issue in his PC.	\N	f	\N	20250910170936-FDB9
cmfdwtxfg0005p8q840fxwhh3	2025-09-10 11:42:29.498	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nNetwork issue.	\N	f	\N	20250910170936-FDB9
cmfdwzleu0007p8q8hxjb8zs7	2025-09-10 11:46:53.86	Network Vendor	Action Taken	Attended the job but found LAN card issue in the PC.	\N	f	\N	20250910170936-FDB9
cmfdx0ui60009p8q8fa6ue33k	2025-09-10 11:47:52.3	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250910170936-FDB9
cmfdx1k4c000bp8q8ddddykf5	2025-09-10 11:48:25.498	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nPC hardware related issue.	\N	f	\N	20250910170936-FDB9
cmfdx2538000dp8q8h2xg5l33	2025-09-10 11:48:52.674	GOUTAM DEBNATH	Action Taken	Referred to ETL with tasks:\n- Hardware Issue\n\n---\nLAN card issue.	\N	f	\N	20250910170936-FDB9
cmfdzftlf000fp8q8ttd3kl8h	2025-09-10 12:55:30.191	ETL User	Action Taken	Changed the LAN card of the PC.	\N	f	\N	20250910170936-FDB9
cmfdzggr5000hp8q80s4vsyl4	2025-09-10 12:56:00.207	ETL User	Resolved	issue solved.	5	f	\N	20250910170936-FDB9
cmfez7d7f0001p8sk1q1cmi81	2025-09-11 05:36:41.878	GOUTAM DEBNATH	Action Taken	Referred to ETL with tasks:\n- Hardware Issue\n\n---\nLAN card issue.	\N	f	\N	20250909175118-F078
cmffhanwk0001p81wc4i65j7b	2025-09-11 14:03:08.801	RAKESH OJHA	Action Taken	Call accepted.	\N	f	\N	20250911191447-35FC
cmffm24q40001p8ighelnpla5	2025-09-11 16:16:28.779	GOUTAM DEBNATH	SAP Password Reset	SAP Password for user RAKESH OJHA (D001212) was reset.\n**ID : D001212 ;&nbsp;&nbsp;&nbsp;New Password : sap3333**	\N	f	\N	20250911191447-35FC
cmffq5cut0001p8g4wwbry3sk	2025-09-11 18:10:57.746	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\npc related issue.	\N	f	\N	20250903003016-0A3C
cmffq5jj00003p8g4wrap88ae	2025-09-11 18:11:06.394	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250903003016-0A3C
cmfgcinfy0001p85w5vtpzy55	2025-09-12 04:37:09.546	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250909175118-F078
cmfgd73is0001jx04ffgpaxze	2025-09-12 04:56:10.131	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250911122013-BF2B
cmfknj57o0001ld04f920achs	2025-09-15 04:56:33.059	MANAS RANJAN JENA	Action Taken	ISSUE ACCEPTED	\N	f	\N	20250915101709-E6BD
cmfknke2m0003ld044ag4kes3	2025-09-15 04:57:31.198	MANAS RANJAN JENA	Action Taken	Referred to Telecom with tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nMAY BE OFC ISSUE	\N	f	\N	20250915101709-E6BD
cmfknp12i0001ib04qvzxzcki	2025-09-15 05:01:07.626	GOUTAM DEBNATH	Action Taken	TESTING CONSOLE OPERATION MODULE FRO GD login	\N	f	\N	20250915101214-638F
cmfknpadw0003ib04i0flhzwu	2025-09-15 05:01:19.7	GOUTAM DEBNATH	Resolved	issue resolved	5	f	\N	20250915101214-638F
cmfknpn720005ib04zppaqgty	2025-09-15 05:01:36.301	GOUTAM DEBNATH	Action Taken	Referred to Telecom with tasks:\n- OFC (Optical Fiber Cable) issue\n\n---\nofc issue resolved	\N	f	\N	20250915101214-638F
cmfp3jbjh0001jl04zsmbsarp	2025-09-18 07:35:39.79	RAKESH OJHA	Action Taken	Call accepted.	\N	f	\N	20250915101948-F81E
cmfp3kjmq0003jl04o3ngzfh9	2025-09-18 07:36:36.961	RAKESH OJHA	Resolved	Testing done successfully.	5	f	\N	20250915101948-F81E
cmfp810lq0001l804m4pca17f	2025-09-18 09:41:23.887	RAKESH OJHA	Action Taken	Hardware related issue.	\N	f	\N	20250909175118-F078
cmfqhxuwf0001p8n4l51mx2sq	2025-09-19 07:06:38.892	RAKESH OJHA	Action Taken	Call accepted.	\N	f	\N	20250919123609-94DD
cmfqhyrg60003p8n4m6q3zocd	2025-09-19 07:07:21.077	RAKESH OJHA	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nLikely network issue.	\N	f	\N	20250919123609-94DD
cmfr2tid30001p814so88qhn9	2025-09-19 16:51:07.957	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250919222033-38CA
cmfr2xcfa0003p814fr9b781w	2025-09-19 16:54:06.882	Network Vendor	Action Taken	Attended the job, found LAN card issue.	\N	f	\N	20250919123609-94DD
cmfr2z2dy0005p814wex3wsfl	2025-09-19 16:55:27.188	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250919123609-94DD
cmfr304ze0007p814rndjoit2	2025-09-19 16:56:17.208	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nReferring the job to ETL.	\N	f	\N	20250919123609-94DD
cmfr30gof0009p8140o73godk	2025-09-19 16:56:32.365	GOUTAM DEBNATH	Priority Changed	Priority changed to "Low".\n---\nAs per SLA.	\N	f	\N	20250919123609-94DD
cmfr3143u000bp814cnuptpo3	2025-09-19 16:57:02.728	GOUTAM DEBNATH	Action Taken	Referred to ETL with tasks:\n- Hardware Issue\n\n---\nLAN card issue.	\N	f	\N	20250919123609-94DD
cmfr32wjv000dp814cbgdbr4i	2025-09-19 16:58:26.236	ETL User	Action Taken	Replaced the LAN card.	\N	f	\N	20250919123609-94DD
cmfr33c22000fp814hqrbb381	2025-09-19 16:58:46.345	ETL User	Resolved	Job done.	5	f	\N	20250919123609-94DD
cmfr3jxrv0001lb048mfs1l2s	2025-09-19 17:11:40.986	GOUTAM DEBNATH	Action Taken	Call accepted.	\N	f	\N	20250911121113-DB5C
cmfr3kix10003lb04eg04ghjk	2025-09-19 17:12:08.388	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nNothing is opening.	\N	f	\N	20250911121113-DB5C
cmfr3nahk0001l1048n24w5gy	2025-09-19 17:14:17.399	Network Vendor	Action Taken	Attended the job found LAN card issue.	\N	f	\N	20250911121113-DB5C
cmfr3osa00003l10479ijhb80	2025-09-19 17:15:27.143	GOUTAM DEBNATH	Type Unlocked	Incident type unlocked for re-assessment.	\N	f	\N	20250911121113-DB5C
cmfr3pgha0005l1049qawrrvj	2025-09-19 17:15:58.509	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nPC related issue.	\N	f	\N	20250911121113-DB5C
cmfr3pv800007l104ghzgsnmp	2025-09-19 17:16:17.615	GOUTAM DEBNATH	Action Taken	Referred to ETL with tasks:\n- Hardware Issue\n\n---\nLAN card issue.	\N	f	\N	20250911121113-DB5C
cmfr3r3lj0009l104avu3rch9	2025-09-19 17:17:15.126	ETL User	Action Taken	Replaced the LAN card.	\N	f	\N	20250911121113-DB5C
cmfr3rj2z000bl104bhwo16v4	2025-09-19 17:17:35.194	ETL User	Resolved	Problem solved.	5	f	\N	20250911121113-DB5C
cmfr65wb80001p8loxi0g77ax	2025-09-19 18:24:44.753	Standard User	re_open	The issue is not resolved.	\N	f	\N	20250911121113-DB5C
cmfr7qp1j0003p8loufcfpqqr	2025-09-19 19:08:54.724	RAKESH OJHA	re_open	The problem has not solved.	\N	f	\N	20250919123609-94DD
cmfr7rv2j0005p8lode936hx3	2025-09-19 19:09:49.192	RAKESH OJHA	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nNetwork team to check.	\N	f	\N	20250919123609-94DD
cmfrqup7k0001p8zwdjbarmra	2025-09-20 04:03:54.268	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "NETWORK".\n---\nNetwork team first check the issue.	\N	f	\N	20250911121113-DB5C
cmfrrbz6u0003p8zwsj1jk2oi	2025-09-20 04:17:20.354	Network Vendor	Action Taken	RJ-45 connector to change.	\N	f	\N	20250911121113-DB5C
cmfrri4ow0005p8zwux5hvgbb	2025-09-20 04:22:07.42	GOUTAM DEBNATH	Action Taken	Referred to Telecom with tasks:\n- RJ-45 Connector replacement\n\n---\nConnector to change.	\N	f	\N	20250911121113-DB5C
cmfrrkc7p0007p8zw5ti6hlmp	2025-09-20 04:23:50.483	Telecom User	Action Taken	Connector changed but pc may have any issue.	\N	f	\N	20250911121113-DB5C
cmfrrkwiv0009p8zwpbxqdafj	2025-09-20 04:24:16.805	Telecom User	Resolved	Telecom end job done.	3	f	\N	20250911121113-DB5C
cmfrrnp4k000bp8zw6n0eylu8	2025-09-20 04:26:27.186	Standard User	re_open	Issue has not solved.	\N	f	\N	20250911121113-DB5C
cmfrrpu6r000dp8zw9g006lot	2025-09-20 04:28:07.057	GOUTAM DEBNATH	Incident Type Changed	Incident Type changed to "PC & PERIPHERALS".\n---\nPC related issue.	\N	f	\N	20250911121113-DB5C
cmfrrqafm000fp8zwzshm79st	2025-09-20 04:28:28.112	GOUTAM DEBNATH	Action Taken	Referred to ETL with tasks:\n- Hardware Issue\n- OS Related Issue\n\n---\nPC related issue.	\N	f	\N	20250911121113-DB5C
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, section) FROM stdin;
cmf68um9m0000p8ic9uis6456	10101	A.G.M. MARKETING.	N/A
cmf68um9n0001p8ic4h7xvbaj	10102	ACVS	N/A
cmf68um9n0002p8icqo5l35p1	10103	ACVS - OFFICE	N/A
cmf68um9n0003p8ictfdxwn1s	10104	ADMIN-MOVEMENT	N/A
cmf68um9n0004p8ics34k54fm	10105	ADMINISTRATION (TECH)	N/A
cmf68um9n0005p8iciefp0n60	10106	AXLE MACHINE SHOP	N/A
cmf68um9n0006p8icg4nkk9ko	10107	BLAST FURNACE	N/A
cmf68um9n0007p8icu9y66d57	10108	BLAST FURNACE (CAST HOUSE)	N/A
cmf68um9n0008p8icjddrjdhb	10109	BLAST FURNACE (CRANE)	N/A
cmf68um9n0009p8iclx435sdr	10110	BLAST FURNACE (ELECT)	N/A
cmf68um9n000ap8ic7xgx66ek	10111	BLAST FURNACE (FURNACE)	N/A
cmf68um9n000bp8ica5ym69pn	10112	BLAST FURNACE (GCP)	N/A
cmf68um9n000cp8icbdxxe1yk	10113	BLAST FURNACE (MECH)	N/A
cmf68um9n000dp8icv1hymsrf	10114	BLAST FURNACE (MIXER BAY)	N/A
cmf68um9n000ep8icu7dss46k	10115	BLAST FURNACE (OFFICE)	N/A
cmf68um9n000fp8icv3wm8wv8	10116	BLAST FURNACE (OPERATION)	N/A
cmf68um9n000gp8ic2z1fom62	10117	BLAST FURNACE (PCM)	N/A
cmf68um9n000hp8icf3oe46q9	10118	BLAST FURNACE (STOCK HOUSE & HL)	N/A
cmf68um9n000ip8ichw30v3ws	10119	BLAST FURNACE (TECH)	N/A
cmf68um9n000jp8ickg1z779o	10120	BUSINESS EXCELLENCE(NON TECH)	N/A
cmf68um9n000kp8icslt8hpwc	10121	BUSINESS EXCELLENCE(TECH)	N/A
cmf68um9n000lp8ichyilj8s1	10122	BUSINESS PLANNING & MKTG.	N/A
cmf68um9n000mp8icjqfj6ib7	98500	C & IT	N/A
cmf68um9n000np8ic30086hdi	98540	C & IT (TECH)	N/A
cmf68um9n000op8ic73428rkv	10123	CALCUTTA BRANCH	N/A
cmf68um9n000pp8icw0gz4h6d	10124	CALCUTTA BRANCH (EXE)	N/A
cmf68um9n000qp8icjuatj8or	10125	CCM & RMW	N/A
cmf68um9n000rp8icwbamtsn9	10126	CCM & RMW (OFFICE)	N/A
cmf68um9n000sp8iczxy6ywxt	10127	CEM	N/A
cmf68um9n000tp8ic9pxqietn	10128	CEM (ELECT)	N/A
cmf68um9n000up8ic8tt5nhqw	10129	CEM (FITTING SHOP)	N/A
cmf68um9n000vp8icvcgj3v16	10130	CEM (FORGE SHOP)	N/A
cmf68um9n000wp8ick4bjoktw	10131	CEM (MACHINE SHOP)	N/A
cmf68um9n000xp8ic3abpu2tz	10132	CEM (MECH)	N/A
cmf68um9n000yp8icgp347cpg	10133	CEM (PLANNING & PROGRESS)	N/A
cmf68um9n000zp8iccrycnhcy	10134	CEM (STORES)	N/A
cmf68um9n0010p8ic8ay6t8ni	10135	CEM (STRUCTURAL SHOP)	N/A
cmf68um9n0011p8ics8bngt8f	10136	CEM (TECH)	N/A
cmf68um9n0012p8icj6hix4bu	10137	CENTRAL CRANE MAINT.	N/A
cmf68um9n0013p8icmx0tz9h6	10138	CENTRAL ELECTRICAL POOL	N/A
cmf68um9n0014p8ic2hl3kn1p	10139	CENTRAL STORES (OFFICE)	N/A
cmf68um9n0015p8icvgtx9grp	10140	CENTRAL STORES (TECH)	N/A
cmf68um9n0016p8ic8lp43hma	10141	CENTRAL STORES DEPTT.	N/A
cmf68um9n0017p8icfce8vhi8	10142	CENTRALISED COMPRESSED AIR STATION	N/A
cmf68um9n0018p8icun9g2ahf	10143	CHRD INDUSTRIAL 2(TRADE APPRENTICE)	N/A
cmf68um9n0019p8icsoj6uubs	10144	CO & CC	N/A
cmf68um9n001ap8iccruon5e7	10145	CO & CC (BATTERY)	N/A
cmf68um9n001bp8icum0o51dc	10146	CO & CC (COAL CHEMICALS)	N/A
cmf68um9n001cp8ic8ot266i9	10147	CO & CC (COAL HANDLING)	N/A
cmf68um9n001dp8icrx3iokt3	10148	CO & CC (ELECT)	N/A
cmf68um9n001ep8icy5oap4np	10149	CO & CC (MECH)	N/A
cmf68um9n001fp8icf1oi0qv8	10150	CO & CC (OFFICE)	N/A
cmf68um9n001gp8icwz0rkipm	10151	COKE OVEN REFRACTORY	N/A
cmf68um9n001hp8ic05lz4y4c	10152	COMPRESSOR AIR STATION	N/A
cmf68um9n001ip8icw2mh3di8	10153	COMPUTER and IT STAFF	N/A
cmf68um9n001jp8ic78wyomsu	10154	CONTRACT DEPTT	N/A
cmf68um9n001kp8icac7tqbxd	10155	CONTRACT DEPTT (TECH)	N/A
cmf68um9n001lp8ic0ka7qvbq	10156	CORPORATE SOCIAL RESPONSIBILITY	N/A
cmf68um9n001mp8ic4a0mknsx	10157	COST CONTROL	N/A
cmf68um9n001np8ic5xi01hrn	10158	DELHI BRANCH OFFICE	N/A
cmf68um9n001op8icxir1owr1	10159	DELHI RESIDANCE OFFICE	N/A
cmf68um9n001pp8ic79uis4mk	10160	DESIGN DEPARTMENT(TECH)	N/A
cmf68um9n001qp8ic7evin17b	10161	DIC'S OFFICE COORDINATION	N/A
cmf68um9n001rp8ic9n6zhxra	10162	DIC'S TECHNICAL CELL	N/A
cmf68um9n001sp8ic5m7pe5t9	10163	DIC's Office	N/A
cmf68um9n001tp8icd62tqht0	10164	ED (WORKS)	N/A
cmf68um9n001up8ic8u11uugz	10165	ED (WORKS) OFFICE	N/A
cmf68um9n001vp8ic7rwpwrs0	10166	ED (WORKS) SECTT	N/A
cmf68um9n001wp8icgclq4npk	10167	ED WORKS (TECH)	N/A
cmf68um9n001xp8ic1d4txu89	10168	EDUCATION (C.B.S.E-1)	N/A
cmf68um9n001yp8ic83mb18m7	10169	EDUCATION (TECH)	N/A
cmf68um9n001zp8icgszki0uc	10170	ELE.COORDINATION (TECH)	N/A
cmf68um9n0020p8icre9j988d	10171	ELECT.COORDINATION	N/A
cmf68um9n0021p8icqlo4wz3b	10172	ELECTRICAL REPAIR SHOP	N/A
cmf68um9n0022p8ic4rcw3e9s	10173	ELECTRICAL REPAIR SHOP (OFFICE)	N/A
cmf68um9n0023p8icjhielf8u	10174	ETL	N/A
cmf68um9n0024p8icy99ffkkn	10175	ENERGY MANAGEMENT DEPTT.	N/A
cmf68um9n0025p8ic5r17ztpt	10176	ENERGY MANAGEMENT DEPTT.(OFFICE)	N/A
cmf68um9n0026p8iczafdx4sr	10177	ENVIRONMENT CONTROL DEPTT	N/A
cmf68um9n0027p8icyi45nmsf	10178	ENVIRONMENT CONTROL DEPTT (OFFICE)	N/A
cmf68um9n0028p8ic9j91dau0	10179	ESTATE & TOWNSHIP BRANCH	N/A
cmf68um9n0029p8icgxo4lp4b	10180	ESTATE-ACCOUNTS	N/A
cmf68um9n002ap8ic712zw38v	10181	ETL (TECH)	N/A
cmf68um9n002bp8ic77xjjvep	10182	F&A-CASH SECTION	N/A
cmf68um9n002cp8icnjlwgplr	10183	F&A-CENTRAL BILL DOCKETING	N/A
cmf68um9n002dp8icix1xxs0v	10184	F&A-COST SECTION	N/A
cmf68um9n002ep8iczf5c5i32	10185	F&A-ESTABLISHMENT SECTION	N/A
cmf68um9n002fp8icxk8lh0q3	10186	F&A-EXCISE CELL	N/A
cmf68um9n002gp8icutjjmk1y	10187	F&A-FINAL SETTLE CELL-PAY	N/A
cmf68um9n002hp8ic6w62g2y0	10188	F&A-IPU PAYMENTS AND ACCOUNT	N/A
cmf68um9n002ip8icpcdlkh7a	10189	F&A-MAIN ACCOUNTS SECTION	N/A
cmf68um9n002jp8icmgw95tza	10190	F&A-MISC WORKS BILL SECTION	N/A
cmf68um9n002kp8ic3s0nipal	10191	F&A-OPERATION BILL SECTION	N/A
cmf68um9n002lp8icbsigrkqw	10192	F&A-PAY ACCOUNTS CELL	N/A
cmf68um9n002mp8ic7sezpl7z	10193	F&A-PAY-EXECUTIVES	N/A
cmf68um9n002np8icizu4gf2d	10194	F&A-PAY-GENERAL	N/A
cmf68um9n002op8icvsnqoipv	10195	F&A-PAY-LTC	N/A
cmf68um9n002pp8ics1e2claf	10196	F&A-PAY-PRODUCTION	N/A
cmf68um9n002qp8icrkdoy40k	10197	F&A-PROVIDENT FUND SECTION	N/A
cmf68um9n002rp8icwrfxb2ai	10198	F&A-RAW MATERIAL ACCOUNTS	N/A
cmf68um9n002sp8ic2yv63a9a	10199	F&A-RLY FREIGHT SECTION	N/A
cmf68um9n002tp8icv5v3b19t	10200	F&A-SALES ACCOUNTS	N/A
cmf68um9n002up8icjnz5th6t	10201	F&A-SALES INVOICE SECTION	N/A
cmf68um9n002vp8iczc7qfbt2	10202	F&A-SALES TAX	N/A
cmf68um9n002wp8ickmem8cse	10203	F&A-STOCK VERIFICATION	N/A
cmf68um9n002xp8ichar5t9qw	10204	F&A-STOCK VERIFICATION (TECH)	N/A
cmf68um9n002yp8icagfutyci	10205	F&A-WELF & MISC BILLS & A/Cs	N/A
cmf68um9n002zp8icr0nyqlqb	10206	FINANCE & A/C BRANCH	N/A
cmf68um9n0030p8ic23pnvsle	10207	FIRE SERVICE	N/A
cmf68um9n0031p8icpzu8t6af	10208	FIRE SERVICES	N/A
cmf68um9n0032p8ic1cpbnn28	10209	FIRE SERVICES (TECH)	N/A
cmf68um9n0033p8icd73j4stk	10210	FOUNDRY	N/A
cmf68um9n0034p8iccsunzbxy	10211	FOUNDRY (CASTING)	N/A
cmf68um9n0035p8icd060n6xw	10212	FOUNDRY (CORE SHOP)	N/A
cmf68um9n0036p8icp800hd7v	10213	FOUNDRY (CUPOLA)	N/A
cmf68um9n0037p8ic1v8tvav9	10214	FOUNDRY (ELECT)	N/A
cmf68um9n0038p8icds18rlj8	10215	FOUNDRY (FETTLING SHOP)	N/A
cmf68um9n0039p8icig1r34t8	10216	FOUNDRY (INGOT MOULDING)	N/A
cmf68um9n003ap8icwpwkxshx	10217	FOUNDRY (MECH)	N/A
cmf68um9n003bp8icrzfbggu6	10218	FOUNDRY (NON FERROUS)	N/A
cmf68um9n003cp8ic8v3fbs5d	10219	FOUNDRY (OFFICE)	N/A
cmf68um9o003dp8icpuinmkri	10220	FOUNDRY (PATTERN SHOP)	N/A
cmf68um9o003ep8icro1qkazc	10221	FOUNDRY (STEEL CASTING)	N/A
cmf68um9o003fp8icc9gdvjlr	10222	FOUNDRY (TECH)	N/A
cmf68um9o003gp8icmi03q3k3	10223	G.M. PROJECTS OFFICE.	N/A
cmf68um9o003hp8ic7qo2h8wv	10224	GARAGE-OFFICE STAFF	N/A
cmf68um9o003ip8ica8juq97j	10225	GARAGE-SUPVRS	N/A
cmf68um9o003jp8icnwks3yx4	10226	GM IT (OFFICE)	N/A
cmf68um9o003kp8icbhc0g76d	10227	HEAVY MAINTENANCE & CONSTN.	N/A
cmf68um9o003lp8ic4ydnllbt	10228	HEAVY MAINTENANCE & CONSTN.(OFFICE	N/A
cmf68um9o003mp8ickpej5c7k	10229	HOSPITAL (TECH)	N/A
cmf68um9o003np8icsl2l5huz	10230	HOSPITAL OFFICE	N/A
cmf68um9o003op8ic6rd5khur	10231	HOSPITAL-TECHNICAL-INDU.	N/A
cmf68um9o003pp8icov3w8wdb	10232	HR	N/A
cmf68um9o003qp8icdyo77eeg	10233	HR (NW)	N/A
cmf68um9o003rp8iczka11xq5	10234	HR (OD)	N/A
cmf68um9o003sp8ic6zo2d01e	10235	HR (RECTT)	N/A
cmf68um9o003tp8icw6dp8ocs	10236	HR (TECH)	N/A
cmf68um9o003up8ic5p1jdx4z	10237	HR (TS)	N/A
cmf68um9o003vp8icobzqfbgb	10238	HR (TS) IND	N/A
cmf68um9o003wp8icqwmdyvp4	10239	HR (WORKS)	N/A
cmf68um9o003xp8ics3u7afck	10240	HR (WORKS) IND	N/A
cmf68um9o003yp8icj0rl9bmf	10241	HR (WORKS) TECH	N/A
cmf68um9o003zp8icib44vd1y	10242	INDUSTRIAL ENGINEERING DEPTT.	N/A
cmf68um9o0040p8icj35y6g7t	10243	INSTRUMENTATION	N/A
cmf68um9o0041p8iccv0eap5g	10244	INSTRUMENTATION (OFFICE)	N/A
cmf68um9o0042p8icjj0x9t3y	10245	INTERNAL AUDIT	N/A
cmf68um9o0043p8icz7aazl7f	10246	IPU (OFFICE)	N/A
cmf68um9o0044p8icr8vejifm	10247	L & D	N/A
cmf68um9o0045p8ic9fepftj8	10248	L & D (ACTT)	N/A
cmf68um9o0046p8icnmvhjrqf	10249	L & D (OCTT)	N/A
cmf68um9o0047p8icwls5gpn6	10250	L & D (TECH)	N/A
cmf68um9o0048p8iclordg5zw	10251	L & D IND	N/A
cmf68um9o0049p8icnivp68ea	10252	L & D OFFICE	N/A
cmf68um9o004ap8icpzl3fhm9	10253	LAW	N/A
cmf68um9o004bp8icadwz9tjb	10254	LAW (TECH)	N/A
cmf68um9o004cp8iced4t6e47	10255	LAW OFFICER	N/A
cmf68um9o004dp8ic20en2tl4	10256	LOCO REPAIR SHOP	N/A
cmf68um9o004ep8icq75kfhn2	10257	LOCO REPAIR SHOP (OFFICE)	N/A
cmf68um9o004fp8ic2r8qr9w4	10258	M&HS(1)	N/A
cmf68um9o004gp8icll68knao	10259	M&HS(2)	N/A
cmf68um9o004hp8icix2qw8d3	10260	MANAGEMENT TRAINEE(TECHNICAL)	N/A
cmf68um9o004ip8icb5qwszd5	10261	MARKETING DIVISION	N/A
cmf68um9o004jp8icdpf88ehi	10262	MATERIAL MANAGEMENT	N/A
cmf68um9o004kp8icn1laacgc	10263	MEDICAL AND HEALTH SERV(OTH)	N/A
cmf68um9o004lp8iczg45r0ee	10264	MEDICAL ORGANISATION	N/A
cmf68um9o004mp8icq96if6ke	10265	MERCHANT MILL (DESP)	N/A
cmf68um9o004np8icqfqm4t15	10266	MERCHANT MILL (ELECT)	N/A
cmf68um9o004op8ic3vqyr3uh	10267	MERCHANT MILL (MECH)	N/A
cmf68um9o004pp8icem8g40qr	10268	MERCHANT MILL (OFFICE)	N/A
cmf68um9o004qp8icsgr1joki	10269	MERCHANT MILL (OPRN)	N/A
cmf68um9o004rp8icv2uqxdol	10270	MERCHANT MILL (TECH)	N/A
cmf68um9o004sp8icye2ud02e	10271	MRD	N/A
cmf68um9o004tp8icwrdwi8fy	10272	MRD & SBO	N/A
cmf68um9o004up8ic2vzluthf	10273	MRD (OFFICE)	N/A
cmf68um9o004vp8ic0edo02rj	10274	MSM (OFFICE)	N/A
cmf68um9o004wp8ic614v5vr9	10275	MSM (OPRN)	N/A
cmf68um9o004xp8iccfp7tjy8	10276	MSM (TECH)	N/A
cmf68um9o004yp8icay7svow4	10277	MTB	N/A
cmf68um9o004zp8icbozcacs3	10278	MTB (TECH)	N/A
cmf68um9o0050p8icdcaedxll	10279	OXYGEN PLANT	N/A
cmf68um9o0051p8icfu05iwlc	10280	OXYGEN PLANT (MECH)	N/A
cmf68um9o0052p8icsgdgjo6h	10281	OXYGEN PLANT (OFFICE)	N/A
cmf68um9o0053p8ic4ww8a9rz	10282	OXYGEN PLANT (OPRN)	N/A
cmf68um9o0054p8icwpywzdmo	10283	OXYGEN PLANT (TECH)	N/A
cmf68um9o0055p8icmplxncac	10284	P.R.O.	N/A
cmf68um9o0056p8ic7d3a4ac5	10285	PERMANENT WAY ENGINEERING	N/A
cmf68um9o0057p8ic47hswik5	10286	PERMANENT WAY ENGINEERING (OFFICE)	N/A
cmf68um9o0058p8ic8i8pnnyn	10287	PLANT CIVIL ENGG. (OFFICE)	N/A
cmf68um9o0059p8ic8q2ccy8b	10288	PLANT CIVIL ENGINEERING	N/A
cmf68um9o005ap8icuet1ewbp	10289	PLANT CIVIL ENGINEERING (DIV I)	N/A
cmf68um9o005bp8ich2ptlb5p	10290	PLANT CIVIL ENGINEERING (DIV II)	N/A
cmf68um9o005cp8icpx2c12f1	10291	PLANT CIVIL ENGINEERING (DIV III)	N/A
cmf68um9o005dp8icxh16wi2w	10292	PLANT CIVIL ENGINEERING (DIV IV)	N/A
cmf68um9o005ep8ic52pdwvz4	10293	PLANT DESIGN & DRAWING DEPTT	N/A
cmf68um9o005fp8icdog82ve9	10294	PLANT DESIGN & DRAWING DEPTT(OFFIC	N/A
cmf68um9o005gp8icwz439gdz	10295	PLANT GARAGE	N/A
cmf68um9o005hp8ic48lifwl6	10296	PLANT GARAGE (M.H.E.M.D.)	N/A
cmf68um9o005ip8ic3z7825an	10297	PLANT GARAGE (M.H.E.O.D.)	N/A
cmf68um9o005jp8icyo6tqx9e	10298	PLANT GARAGE (OFFICE - MAINT)	N/A
cmf68um9o005kp8ic30lfyr43	10299	PLANT GARAGE (OFFICE - OPRN)	N/A
cmf68um9o005lp8icu6wni1f7	10300	PLANT GARAGE (TECH)	N/A
cmf68um9o005mp8icm4kb6kpa	10301	POWER MANAGEMENT DEPTT.	N/A
cmf68um9o005np8icvfp8y5z6	10302	POWER MANAGEMENT DEPTT.(OFFICE)	N/A
cmf68um9o005op8ic47jfbiem	10303	POWER PLANT	N/A
cmf68um9o005pp8icj6o406cq	10304	POWER PLANT (ELECT)	N/A
cmf68um9o005qp8icdwqw2n3v	10305	POWER PLANT (MECH)	N/A
cmf68um9o005rp8iccas42vt3	10306	POWER PLANT (OFFICE)	N/A
cmf68um9o005sp8ic28zimgxp	10307	POWER PLANT (OPRN)	N/A
cmf68um9o005tp8ic6znjzizh	10308	PPCD	N/A
cmf68um9o005up8ic1azrl86v	10309	PPCD (TECH)	N/A
cmf68um9o005vp8ic3g1s8onm	10310	PROJECT ENGINEERING DEPTT.	N/A
cmf68um9o005wp8icxheptgcs	10311	PROJECTS (TECH)	N/A
cmf68um9o005xp8icwpx3nzzd	10312	PUBLIC RELATIONS	N/A
cmf68um9o005yp8ic8fi4svya	10313	PUBLIC RELATIONS (TECH)	N/A
cmf68um9o005zp8ic2tua33h8	10314	PURCHASE (TECH)	N/A
cmf68um9o0060p8iclgrqxtej	10315	PURCHASE SECTION	N/A
cmf68um9o0061p8ics85moh14	10316	Project Technical	N/A
cmf68um9o0062p8icnx8b83rp	10317	R & C LABORATORY	N/A
cmf68um9o0063p8icxew88bcv	10318	R & C LABORATORY (OFFICE)	N/A
cmf68um9o0064p8ic1s1pz3pr	10319	RAJBHASHA (TECH)	N/A
cmf68um9o0065p8icnpd57tps	10320	RAJBHASHA VIBHAG	N/A
cmf68um9o0066p8icx35ao6vg	10321	RAW MATERIALS DEPTT.	N/A
cmf68um9o0067p8ic7vx0c7uc	10322	RAW MATERIALS DEPTT. (OFFICE)	N/A
cmf68um9o0068p8ic0om99cze	10323	REFRACTORY	N/A
cmf68um9o0069p8ic4cigs5sv	10324	REFRACTORY (OFFICE)	N/A
cmf68um9o006ap8icjl06a8wf	10325	RMD (TECH)	N/A
cmf68um9o006bp8icjdv0svh5	10326	RMHP	N/A
cmf68um9o006cp8icpjqrw2g8	10327	RMHP (ELECT)	N/A
cmf68um9o006dp8icfsp0bc6g	10328	RMHP (MECH)	N/A
cmf68um9o006ep8iccx6rdd3p	10329	RMHP (OFFICE)	N/A
cmf68um9o006fp8ic09kwp97l	10330	RMHP (OPRN)	N/A
cmf68um9o006gp8ic7fcu4u7m	10331	ROLL SHOP	N/A
cmf68um9o006hp8icel3bt5w5	10332	ROLL SHOP (TECH)	N/A
cmf68um9o006ip8icfgxsbfyz	10333	S E TOWNSHIP MAINTENANCE	N/A
cmf68um9o006jp8iccoe7toox	10334	S M S OFFICE STAFF	N/A
cmf68um9o006kp8ic74xa1loa	10335	SAFETY ENGG	N/A
cmf68um9o006lp8ic01idb7lm	10336	SAFETY ENGG (OFFICE)	N/A
cmf68um9o006mp8iceyfg7ymf	10337	SAFETY ENGG (TECH)	N/A
cmf68um9o006np8icp5f94g8b	10338	SECTION MILL (DESP)	N/A
cmf68um9o006op8icibtg673d	10339	SECTION MILL (ELECT)	N/A
cmf68um9o006pp8ic37plyklw	10340	SECTION MILL (MECH)	N/A
cmf68um9o006qp8icvd2qurl5	10341	SECTION MILL (OFFICE)	N/A
cmf68um9o006rp8ic4r5cy5lv	10342	SECTION MILL (OPRN)	N/A
cmf68um9o006sp8ico12w3d6i	10343	SINTER PLANT (OFFICE)	N/A
cmf68um9o006tp8icz76xb94j	10344	SINTER PLANT (TECH)	N/A
cmf68um9o006up8icg7inxpoy	10345	SINTERING PLANT	N/A
cmf68um9o006vp8icdlbls6jz	10346	SINTERING PLANT (ELECT)	N/A
cmf68um9o006wp8icfxak6gsr	10347	SINTERING PLANT (MECH)	N/A
cmf68um9o006xp8ice8agdcb6	10348	SINTERING PLANT (OPRN)	N/A
cmf68um9o006yp8ic89piate5	10349	SLAG BANK	N/A
cmf68um9o006zp8ic2d9qgk0c	10350	SLAG BANK (OFFICE)	N/A
cmf68um9o0070p8ic6qvxa855	10351	SMS	N/A
cmf68um9o0071p8iciv8br4bl	10352	SMS (Com.Pool)	N/A
cmf68um9o0072p8ic57d88jvq	10353	SMS (OFFICE)	N/A
cmf68um9o0073p8icj6zo73d0	10354	SMS (TECH)	N/A
cmf68um9o0074p8icrwlxwnj5	10355	SMS-AUX (ELECT)	N/A
cmf68um9o0075p8icfsnjmg6l	10356	SMS-AUX (MECH)	N/A
cmf68um9o0076p8ic20vob1br	10357	SMS-AUX (OPRN)	N/A
cmf68um9o0077p8icju6so637	10358	SMS-BOF (ELECT)	N/A
cmf68um9o0078p8icbeyiuvjf	10359	SMS-BOF (MECH)	N/A
cmf68um9o0079p8ic9xuaapeb	10360	SMS-BOF (OPRN)	N/A
cmf68um9o007ap8icbf9kdcj2	10361	SMS-CCP (ELECT)	N/A
cmf68um9o007bp8ictoibg5e1	10362	SMS-CCP (MECH)	N/A
cmf68um9o007cp8icmt1q12hh	10363	SMS-CCP (OPRN)	N/A
cmf68um9o007dp8ic503tg9aa	10364	SPU	N/A
cmf68um9o007ep8icqcmqyzc0	10365	SPU(TECH)	N/A
cmf68um9o007fp8ic8uweoy1r	10366	STRUCTURAL INSPECTION	N/A
cmf68um9o007gp8ic6mb5fy4m	10367	TELECOM	N/A
cmf68um9o007hp8icfxp23weu	10368	TOTAL QUALITY MANAGEMENT	N/A
cmf68um9o007ip8icqd70tjoa	10369	TOWN SERV-B&R/PHM	N/A
cmf68um9p007jp8icp8ltbcpb	10370	TOWN SERV-ELECT MAINT.	N/A
cmf68um9p007kp8icb7a8jfyt	10371	TOWN SERVICES (TECH)	N/A
cmf68um9p007lp8iciwmztcqz	10372	TOWNSHIP MAINTENANCE	N/A
cmf68um9p007mp8icis3rzjrv	10373	TRAFFIC	N/A
cmf68um9p007np8icyh3krm4b	10374	TRAFFIC (OFFICE)	N/A
cmf68um9p007op8icr2umwqkj	10375	TXR	N/A
cmf68um9p007pp8icvv0ffft9	10376	TXR (OFFICE)	N/A
cmf68um9p007qp8icjqhtivsk	10377	VIGILANCE	N/A
cmf68um9p007rp8icdpe1dtbc	10378	VIGILANCE (TECH)	N/A
cmf68um9p007sp8icktvxlrbt	10379	VIGILANCE FIELD STAFF	N/A
cmf68um9p007tp8ic63chopmo	10380	WAGON REPAIR SHOP	N/A
cmf68um9p007up8icw9342yg9	10381	WAGON REPAIR SHOP (OFFICE)	N/A
cmf68um9p007vp8icdsb5f4b9	10382	WHEEL & AXLE PLANT (ELECT)	N/A
cmf68um9p007wp8icrxaij5to	10383	WHEEL & AXLE PLANT (MECH)	N/A
cmf68um9p007xp8icvajdw0jr	10384	WHEEL & AXLE PLANT (OFFICE)	N/A
cmf68um9p007yp8icm0mtfj9j	10385	WHEEL & AXLE PLANT (OPRN - ZONE I)	N/A
cmf68um9p007zp8iccse4u73m	10386	WHEEL & AXLE PLANT (OPRN - ZONE II)	N/A
cmf68um9p0080p8icfjubi21t	10387	WHEEL & AXLE PLANT (OPRN)	N/A
cmf68um9p0081p8icpe2oh0m7	10388	WHEEL & AXLE PLANT (TECH)	N/A
cmf68um9p0082p8ichf3lxwsu	10389	WMD	N/A
cmf68um9p0083p8ic8zxojfc9	10390	WMD (MECH)	N/A
cmf68um9p0084p8ic9hl4x17s	10391	WMD (OFFICE)	N/A
cmf68um9p0085p8icvejwfd5d	10392	WMD (PIPE LINE)	N/A
cmf68um9p0086p8icpa7n0mny	10393	WMD (PUMP HOUSE)	N/A
cmf68um9p0087p8icusuct109	10394	WMD (TECH)	N/A
cmf68um9p0088p8ic72hgqlgq	10395	WMD (WATER TREATMENT)	N/A
\.


--
-- Data for Name: incident_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incident_types (id, name) FROM stdin;
cmesk84et0089p824uwcma3ks	BIOMETRIC
cmesk84et008ap824v5f7rhs1	CCTV
cmesk84et008bp824q9n410r3	DSP.COM APPLICATIONS
cmesk84et008cp824b7djsmy6	ESS PASSWORD
cmesk84et008dp8246v13xjjw	ILINK INSTALLATION
cmesk84et008ep824ohgmvr3p	INFRASTRUCTURE
cmesk84et008fp82494x9god6	INTERNET
cmesk84et008gp824uh1yutu9	JAGRITI
cmesk84et008hp82453eb9x4e	NETWORK
cmesk84et008ip824tl0djrsd	NEW DESKTOP
cmesk84et008jp824k302k94c	OTHERS
cmesk84et008kp824azcrugpk	PAYROLL
cmesk84et008lp824oafjekq8	PC & PERIPHERALS
cmesk84et008mp824y75nh7mg	POWER
cmesk84et008np8248pi7b3vb	PRINTERS
cmesk84et008op8246mnuursa	PROCESS CONTROL
cmesk84et008pp824b4m7e71o	SAIL.IN
cmesk84et008qp824dmbq7i5k	SAP CONNECTIVITY
cmesk84et008rp8240e2jz00l	SAP FUNCTIONAL
cmesk84et008sp8242k1hdxdi	SAP FUNCTIONAL - BI
cmesk84et008tp824x42ib8ag	SAP FUNCTIONAL - CO
cmesk84et008up824wyhqjiil	SAP FUNCTIONAL - FI
cmesk84et008vp824b5rq2aa7	SAP FUNCTIONAL - MM/SRM
cmesk84et008wp824i6876myr	SAP FUNCTIONAL - PM
cmesk84et008xp82452qy0d27	SAP FUNCTIONAL - PP
cmesk84et008yp824qaf7eh8t	SAP FUNCTIONAL - QM
cmesk84et008zp824iy7kd0qt	SAP FUNCTIONAL - RE
cmesk84et0090p824vrfxj1ii	SAP FUNCTIONAL - SD
cmesk84et0091p8245mi8akb9	SAP GUI INSTALLATION
cmesk84et0092p824ulqh5l2j	SAP PASSWORD/AUTHENTICATION
cmesk84et0093p824lpzbhdyo	SAP PORTAL
cmesk84et0094p8240apyxzgr	SAP-CHANGE MGMT(TR)
cmesk84et0095p824h373f5xt	SAP-ROLE MGMT
cmesk84et0096p8244y6cb56b	SAP-USER ACCESS MGMT
cmesk84et0097p824bg1d8o5i	SBI PAYMENT GATEWAY
cmesk84et0098p8240k9mf8jg	SECURITY
cmesk84et0099p824o9xmzfo8	SRM PORTAL
cmesk84et009ap824crs8uvo8	VC SUPPORT
cmesk84et009bp824n9qnzm9p	VPN
cmesk84et009cp824u4oa0qwo	WEB APPLICATION DEVELOPMENT
cmesk84et009dp824o0zpzy5s	WEBMAIL
cmesk84et009ep824f570ffj9	WINDOWS ACTIVATION
cmesk84et009fp824pezc5650	WINDOWS MAIL
\.


--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incidents (id, "shiftDate", "jobTitle", description, priority, status, location, "ipAddress", "jobFrom", "reportedOn", "isTypeLocked", "isPriorityLocked", "affectedTicketNo", rating, "telecomTasks", "assignedTeam", "etlTasks", "incidentTypeId", "requestorId", "affectedUserId") FROM stdin;
20250826205620-82B7	2025-08-26 15:26:20.941	network	No connectivity in user's PC. User - RAMESHBABU PRAGGNANANDHAA	Medium	New	office	127.0.0.1	\N	2025-08-26 15:26:20.941	\N	\N		\N	\N	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk878x009tp824ch1tjalw	\N
20250826212238-828E	2025-08-26 15:52:38.488	printer	Printers are not working.	Medium	New	C & IT	127.0.0.1	\N	2025-08-26 15:52:38.488	\N	\N		\N	\N	C&IT	\N	cmesk84et008np8248pi7b3vb	cmesk878x009tp824ch1tjalw	\N
20250911120047-2979	2025-09-11 06:30:47.344	ilink	ilink to install.	Medium	New	office	127.0.0.1	\N	2025-09-11 06:30:47.344	\N	\N		\N	\N	C&IT	\N	cmesk84et008dp8246v13xjjw	cmesk8548009hp824k2id7ey1	\N
20250907192556-1C1F	2025-09-07 13:55:56.59	network	No network.	Medium	Processed	office	127.0.0.1	\N	2025-09-07 13:55:56.59	\N	t		\N	\N	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250826205902-8C24	2025-08-26 15:29:02.157	network	No network in 2 PC.	Medium	Processed	C & IT	127.0.0.1	\N	2025-08-26 15:29:02.157	\N	\N		\N	{"OFC (Optical Fiber Cable) issue"}	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250903002015-CE78	2025-09-02 18:50:15.48	network	No network.	Medium	Pending Telecom Action	office	127.0.0.1	\N	2025-09-03 18:50:15.48	f	f		\N	{"OFC (Optical Fiber Cable) issue"}	Telecom	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250902183024-9885	2025-09-02 13:00:24.098	network	No network in ers building.	Medium	Processed	office	127.0.0.1	\N	2025-09-02 13:00:24.098	\N	\N		\N	{"OFC (Optical Fiber Cable) issue"}	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250902191632-C070	2025-09-02 13:46:32.7	network	No network.	Medium	Processed	office	127.0.0.1	\N	2025-09-02 13:46:32.7	\N	\N		\N	{"OFC (Optical Fiber Cable) issue"}	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250911191447-35FC	2025-09-11 13:44:47.971	sap password	SAP password to reset.	Medium	Processed	C & IT	127.0.0.1	\N	2025-09-11 13:44:47.971	\N	\N		\N	\N	C&IT	\N	cmesk84et0092p824ulqh5l2j	cmesk8b6o00afp82429mu44jd	\N
20250902210646-B7E4	2025-09-02 15:36:46.743	network	Network issue.	Medium	Processed	office	127.0.0.1	\N	2025-09-02 15:36:46.743	\N	\N		\N	{"OFC (Optical Fiber Cable) issue"}	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250908173957-9111	2025-09-08 12:09:57.667	network	No network in two PC.	Low	Pending Telecom Action	ccp	127.0.0.1	\N	2025-09-08 12:09:57.667	\N	t		\N	{"Media Converter (MC) issue"}	Telecom	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250903192233-E4F9	2025-09-03 13:52:33.821	network	No network in two PC.	Medium	Processed	office	127.0.0.1	\N	2025-09-03 13:52:33.821	\N	\N		\N	{"OFC (Optical Fiber Cable) issue"}	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250908173653-7969	2025-09-08 12:06:53.62	biometric	The m/c is out of order.	Low	Resolved	office	127.0.0.1	\N	2025-09-08 12:06:53.62	\N	t		5	\N	C&IT	\N	cmesk84et0089p824uwcma3ks	cmesk8548009hp824k2id7ey1	\N
20250915101948-F81E	2025-09-15 04:49:48.623	sap bi module problem	Testing sys admin module of IMS Dash board	High	Resolved	c & it	210.212.5.237	\N	2025-09-15 04:49:48.623	\N	\N		5	\N	C&IT	\N	cmesk84et008sp8242k1hdxdi	cmesk89bm00a5p824yrmp1nq1	\N
20250903010241-C0D9	2025-09-02 19:32:41.179	network	No network.	Medium	Processed	office	127.0.0.1	\N	2025-09-03 19:32:41.179	\N	\N		\N	\N	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250903003016-0A3C	2025-09-02 19:00:16.933	network	No network.	Medium	Processed	office	127.0.0.1	\N	2025-09-03 19:00:16.933	f	\N		\N	\N	C&IT	\N	cmesk84et008lp824oafjekq8	cmesk8548009hp824k2id7ey1	\N
20250909175118-F078	2025-09-09 12:21:18.155	dsp.com	dsp.com not opening.	Medium	Pending ETL Action	office	127.0.0.1	\N	2025-09-09 12:21:18.155	f	\N		\N	\N	ETL	\N	cmesk84et008lp824oafjekq8	cmesk8548009hp824k2id7ey1	\N
20250911122013-BF2B	2025-09-11 06:50:13.255	network	No network.	Medium	Processed	BOF	127.0.0.1	\N	2025-09-11 06:50:13.255	\N	\N		\N	\N	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250908115834-3533	2025-09-08 06:28:34.028	Reset ESS password	Reset ess password.	Medium	Processed	C & IT	127.0.0.1	\N	2025-09-08 06:28:34.028	t	\N	498301	\N	\N	C&IT	\N	cmesk84et008lp824oafjekq8	cmesk8548009hp824k2id7ey1	\N
20250915101831-7B80	2025-09-15 04:48:31.697	BI module not working	While saving in BI module it is showing error unable to save	Medium	New	safety department	210.212.5.237	\N	2025-09-15 04:48:31.697	\N	\N		\N	\N	C&IT	\N	cmesk84et008gp824uh1yutu9	cmesk89bm00a5p824yrmp1nq1	\N
20250915101709-E6BD	2025-09-15 04:47:09.319	NO NETWORK  AT HOSPITAL	NO Network at TA BUILDING AND HOSPITAL SINCE 13:15 hrs	High	Pending Telecom Action	HOSPITAL AND TA BUILDING	210.212.5.237	\N	2025-09-15 04:47:09.319	\N	\N		\N	{"OFC (Optical Fiber Cable) issue"}	Telecom	\N	cmesk84et008hp82453eb9x4e	cmesk89bm00a5p824yrmp1nq1	\N
20250910170936-FDB9	2025-09-10 11:39:36.426	dsp.com	dsp.com not opening.	Medium	Resolved	office	127.0.0.1	\N	2025-09-10 11:39:36.426	t	\N		5	\N	ETL	\N	cmesk84et008lp824oafjekq8	cmesk8548009hp824k2id7ey1	\N
20250915101214-638F	2025-09-15 04:42:14.451	Network swtich  problem	unable to login in ESS	Medium	Pending Telecom Action	BLAST FURNACE ADMIN BUILDING	210.212.5.237	\N	2025-09-15 04:42:14.451	\N	\N		5	{"OFC (Optical Fiber Cable) issue"}	Telecom	\N	cmesk84et008hp82453eb9x4e	cmesk89bm00a5p824yrmp1nq1	\N
20250911111533-6130	2025-09-11 05:45:33.202	ess	ESS password to reset.	Medium	New	office	127.0.0.1	\N	2025-09-11 05:45:33.202	\N	\N	342638	\N	\N	C&IT	\N	cmesk84et008cp824b7djsmy6	cmesk8548009hp824k2id7ey1	\N
20250911115600-2D09	2025-09-11 06:26:00.317	network	No network.	Medium	New	BOF	127.0.0.1	\N	2025-09-11 06:26:00.317	\N	\N		\N	\N	C&IT	\N	cmesk84et008hp82453eb9x4e	cmesk8548009hp824k2id7ey1	\N
20250919222033-38CA	2025-09-19 16:50:33.086	internet	Internet not working.	Medium	Processed	office	127.0.0.1	\N	2025-09-19 16:50:33.086	\N	\N		\N	\N	C&IT	\N	cmesk84et008fp82494x9god6	cmesk878x009tp824ch1tjalw	\N
20250919123609-94DD	2025-09-19 07:06:09.273	sap connectivity	SAP connectivity not available.	Low	Processed	office	127.0.0.1	\N	2025-09-19 07:06:09.273	t	f		\N	\N	ETL	\N	cmesk84et008hp82453eb9x4e	cmesk8b6o00afp82429mu44jd	\N
20250911121113-DB5C	2025-09-11 06:41:13.442	internet	internet is not opening.	Medium	Pending ETL Action	ccp	127.0.0.1	\N	2025-09-11 06:41:13.442	t	f		\N	{"RJ-45 Connector replacement"}	ETL	\N	cmesk84et008lp824oafjekq8	cmesk8548009hp824k2id7ey1	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, role, name, password, "ticketNo", "essUserId", designation, "contactNo", "emailId", "emailIdNic", "sailPNo", "passwordLastChanged", "departmentId", "createdAt", "updatedAt") FROM stdin;
cmesk85gq009jp8243d9qh1cx	admin	ARUN KUMAR GORAI	$2a$10$O2jB8qmKiwAkBWkDCLePP.0QUAf7x8DrfnCqpUepET67nTn2aNj6W	305819	305819	S-11	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D106134	2025-08-26 13:06:28.394	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:28.394	2025-09-05 02:56:48.669
cmesk8548009hp824k2id7ey1	standard	Standard User	$2a$10$Ps5kMog3U415iKJWYpqbwOVNOm8LlkmXUUapytSHtL3DEAJVD.R0u	111111	111111	N/A	\N	\N	\N	\N	2025-08-26 13:06:27.944	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:27.944	2025-09-05 02:56:48.405
cmesk85tl009lp8246v3ba0hn	admin	ANUP KUMAR SARKAR	$2a$10$KEFHwRnStGpRdSyhOtPrA.dmg5VPkNq8IWgWn7ttlg5ltmIWnkqjC	335426	335426	S-7	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D112333	2025-08-26 13:06:28.857	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:28.857	2025-09-05 02:56:48.917
cmesk866c009np824yhnd72a8	admin	BIPLAB SIKDAR	$2a$10$IpOBLcsCw5a3HY.EUovCx.vOFx5j2TfubU8bptupjYgO5R5fUxj4q	340090	340090	S-11	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D106103	2025-08-26 13:06:29.316	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:29.316	2025-09-05 02:56:49.163
cmesk86iu009pp8244gfqzugc	admin	BIPLAB SEN	$2a$10$6snud7vQC7RxZ0QjD7REB.e2YoXsfH2El0suszm0FAMtii14Y5ray	341894	341894	S-11	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D109151	2025-08-26 13:06:29.766	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:29.766	2025-09-05 02:56:49.402
cmesk86vk009rp824lrznjxxe	admin	PIJUSH KANTI DAS	$2a$10$3pAnzpA2o0vgRrJpBRntzul5gZ4U9iyjhAbm7WkoJbQfb9nBEi4cm	342168	342168	S-10	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D110823	2025-08-26 13:06:30.224	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:30.224	2025-09-05 02:56:49.649
cmesk878x009tp824ch1tjalw	admin	GOUTAM DEBNATH	$2a$10$S4vjT1oi3M9d/2QwvoaKR.jB3efh3GxQeNlPOfu5s5I2e4yKM1vTW	342461	342461	S-11	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D111086	2025-08-26 13:06:30.705	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:30.705	2025-09-05 02:56:49.9
cmesk87kl009vp824hfgt3xzu	admin	DILIP KUMAR DHIBAR	$2a$10$xaOcdyWkoEN8gasfsUhQZewHCNyW4uTQQT4iIht9IB8FFpEZjcV76	342638	342638	S-10	NOT AVAILABLE	NOT AVAILABLE	NOT AVAILABLE	D110639	2025-08-26 13:06:31.125	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:31.125	2025-09-05 02:56:50.145
cmesk87wx009xp824z2f40dw8	sys_admin	TANMAY CHATTERJEE	$2a$10$G6oBP0vb2Fo5YGDcKbrUBORs7SdYoEhd6lMU6J2TJfCd/hHyxC7vi	442223	442223	Junior Manager	9434793266	\N	tanmay.chatterjee@sail.in	\N	2025-08-26 13:06:31.569	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:31.569	2025-09-05 02:56:50.388
cmesk889b009zp824f0ykf0m4	sys_admin	ARGHYA PODDER	$2a$10$ICyMi0JrjI5Ch4e5YstpDOr31JOrBmzrKj/Cn5W3yFD5BSVmONuOW	442603	442603	Junior Manager	9434793265	\N	arghya.p@sail.in	\N	2025-08-26 13:06:32.015	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:32.015	2025-09-05 02:56:50.628
cmesk88lz00a1p824dszhpfu2	sys_admin	JYOTISH SAIKIA	$2a$10$IWgQICdmJN954Rjt9NXaTu3fe832mJ0CswZFKOTSo9nvCKI49TlIe	490075	490075	Asst. Manager	9434793042	\N	jyotishsaikia@sail.in	D002200	2025-08-26 13:06:32.472	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:32.472	2025-09-05 02:56:50.872
cmesk88y200a3p824ou82lbya	sys_admin	ALOPI BANERJEE	$2a$10$qis4STAAxLG1tPxaAue1eel40VUF3maoEfkKk3ozuslUdJW8VRMVq	497922	497922	General Manager	9434792583	alopi@saildsp.co.in	alopi@sail.in	D000807	2025-08-26 13:06:32.906	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:32.906	2025-09-05 02:56:51.113
cmesk89bm00a5p824yrmp1nq1	sys_admin	MOHD ANWAR ULLAH	$2a$10$BB/d58dQSCbhQlyGVT0rCuLWrFzcOUlBWmVQ7W/aVaxN4HDHLRhSa	498301	498301	General Manager	9434792584	anwar@saildsp.co.in	anwar@sail.in	D000896	2025-08-26 13:06:33.394	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:33.394	2025-09-05 02:56:51.359
cmesk89oq00a7p824jfgxrqbq	sys_admin	MANAS RANJAN JENA	$2a$10$N7VrGgQ7aisg2a55hZc6lOrRWzYFNjidu9EOvJNDtSQh/mEVKxCiu	498477	498477	General Manager	9434792588	mrjena@saildsp.co.in	mrjena@sail.in	D001015	2025-08-26 13:06:33.866	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:33.866	2025-09-05 02:56:51.601
cmesk8a2f00a9p824aj5lnltd	sys_admin	RAMDARAS SINGH KUSHWAHA	$2a$10$ZEJ3hQfNfUK5K3DYAtnp9ubZCq0lcjGmTVQgtUqZiCKBcosoztBXa	498554	498554	General Manager	9434792587	rdsk@saildsp.co.in	rdsk@sail.in	D001008	2025-08-26 13:06:34.359	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:34.359	2025-09-05 02:56:51.84
cmesk8afr00abp824wbgqlsp9	sys_admin	RANA SAHA	$2a$10$r2klpmXJYYN5nGbger/Nr.On611qgd5uKmKZYd6RVfaXZH7bVorG2	498560	498560	General Manager	9434792591	rana_saha@saildsp.co.in	rana.saha@sail.in	D001079	2025-08-26 13:06:34.839	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:34.839	2025-09-05 02:56:52.083
cmesk8asl00adp824y24ycygg	sys_admin	ARINDAM PAUL	$2a$10$frCb7/JQ.Gf0IQ.dGvqDze4VvZf2GSe5jE9AKgbzspcCX4hAHiTUG	498823	498823	General Manager	9434792592	arindam@saildsp.co.in	arindam@sail.in	D001176	2025-08-26 13:06:35.301	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:35.301	2025-09-05 02:56:52.329
cmesk8b6o00afp82429mu44jd	sys_admin	RAKESH OJHA	$2a$10$p7vtmG77wgGohXpulytFKet2C9qpZ1jAd04veusA8E.O3dHJLUUse	498880	498880	Dy. General Manager	9434792593	rakesh.ojha@saildsp.co.in	rakesh.ojha@sail.in	D001212	2025-08-26 13:06:35.808	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:35.808	2025-09-05 02:56:52.57
cmesk8bk000ahp82415lqc9pk	sys_admin	SHYAMA PRASAD CHAKRABORTY	$2a$10$oweuSzbM7.qdjpxgKKt2ieYWXlPLN3NWat9Xuh9BmLjlw41uioeYC	498881	498881	Dy. General Manager	9434792595	shyama@saildsp.co.in	shyama@sail.in	D001226	2025-08-26 13:06:36.288	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:36.288	2025-09-05 02:56:52.815
cmesk8bwm00ajp824leajmkiy	sys_admin	DEBAPRIYA DATTA	$2a$10$zDwtlnPXbEGnObRLmaLL6.7z29T1cq51O.GI5AWsjcWD27pNvCgJq	499119	499119	Dy. General Manager	9434792650	debapriya@saildsp.co.in	debapriya@sail.in	D001612	2025-08-26 13:06:36.742	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:36.742	2025-09-05 02:56:53.073
cmesk8c8x00alp824tie2rco2	sys_admin	MANISH KUMAR	$2a$10$xI3.jlGugkO4dXovkmKGZ.lusA6myOcuPcIImlihOBkNYUp9ZJyH2	499312	499312	Asst.General Manager	9434792369	manish1028@saildsp.co.in	manish1028@sail.in	D001783	2025-08-26 13:06:37.185	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:37.185	2025-09-05 02:56:53.326
cmesk8clt00anp824m4snf1lm	sys_admin	SUDHIR KUMAR LAKRA	$2a$10$wozP9ylM4Mq2H.2X511JyenUNnuBuzHLHqMOpCy1BZUHcvlhLo6FO	499313	499313	Asst.General Manager	9434792360	sklakra@saildsp.co.in	sklakra@sail.in	D001784	2025-08-26 13:06:37.649	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:37.649	2025-09-05 02:56:53.569
cmesk8cyk00app824fc83inlh	sys_admin	AVINASH KUMAR	$2a$10$D/TiRFhvGmsTF95522z/OOcHUQ4RNp3ekmjaeNF8xmsgbZd4EXoBe	499385	499385	Asst.General Manager	9434792213	avinash@saildsp.co.in	avinash.dsp@sail.in	D001837	2025-08-26 13:06:38.108	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:38.108	2025-09-05 02:56:53.814
cmesk8dc200arp82421vpe2c4	sys_admin	DEBAJYOTI MANDAL	$2a$10$zwoPZo5O1TP527tYp4QgyOqzczHo1wVdNoodO8sT4fs69HPGWUVh6	499446	499446	Asst.General Manager	9434792782	debajyoti_mandal@saildsp.co.in	debajyoti.mandal@sail.in	D001880	2025-08-26 13:06:38.594	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:38.594	2025-09-05 02:56:54.058
cmesk8dp300atp824z5z2mi0n	sys_admin	ABHISHEK CHAKRABORTY	$2a$10$tVVmssGOXZZ4p7x6L7PBKOwRlQ914K.VnXa.QHabNRI0rf2wORsA2	499529	499529	Asst.General Manager	9434792409	achakraborty@saildsp.co.in	achakraborty@sail.in	D001912	2025-08-26 13:06:39.063	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:39.063	2025-09-05 02:56:54.302
cmesk8e2900avp8241z3ed3kd	sys_admin	NABARUN GHOSH	$2a$10$m4wz4ZWjgvjG2eVGiR9Y2OuHW7kJe0owhDenUx4scTbtnnbuVAuLW	499570	499570	Sr. Manager	9434792423	nabarun.ghosh@saildsp.co.in	nabarun.ghosh@sail.in	D001926	2025-08-26 13:06:39.537	cmf68um9n000mp8icjqfj6ib7	2025-08-26 13:06:39.537	2025-09-05 02:56:54.548
cmesk8eeh00axp82409yl11d4	network_vendor	Network Vendor	$2a$10$Qje5vqJFxcI.L2UwMHxOcO1CvG7lenj36PbsSbi/RejJGcFwfYTci	network.vendor	network.vendor	N/A	\N	\N	\N	\N	2025-08-26 13:06:39.977	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:39.977	2025-09-05 02:56:54.794
cmesk8f3n00b1p824rwtrj06p	telecom_user	Telecom User	$2a$10$Vv0iW90V9pcBzV9HwtpsM.w0nbjz4b6W0O4jqDff6qxruz.gFyaNe	telecom	telecom	N/A	\N	\N	\N	\N	2025-08-26 13:06:40.883	cmf68um9o007gp8ic6mb5fy4m	2025-08-26 13:06:40.883	2025-09-05 02:56:55.289
cmesk8fgi00b3p824q1v1vmi9	etl	ETL User	$2a$10$lXvFSl03mpkNq20W7WmwSeV5vj6EGhIDonsE41cu9OCI9N0IrUtC6	etl	etl	N/A	\N	\N	\N	\N	2025-08-26 13:06:41.346	cmf68um9n0023p8icjhielf8u	2025-08-26 13:06:41.346	2025-09-05 02:56:55.534
cmesk8eqt00azp824iiakld8f	biometric_vendor	Biometric Vendor	$2a$10$tC5VPDFcNfgq9X1CjrKzxO0M2NNdMdDFMHNoaQdxSTvZhZujrpPry	biometric.vendor	biometric.vendor	N/A	\N	\N	\N	\N	2025-08-26 13:06:40.421	cmf68um9n000np8ic30086hdi	2025-08-26 13:06:40.421	2025-09-05 02:56:55.036
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-08-17 09:54:16
20211116045059	2025-08-17 09:54:17
20211116050929	2025-08-17 09:54:18
20211116051442	2025-08-17 09:54:19
20211116212300	2025-08-17 09:54:19
20211116213355	2025-08-17 09:54:20
20211116213934	2025-08-17 09:54:21
20211116214523	2025-08-17 09:54:21
20211122062447	2025-08-17 09:54:22
20211124070109	2025-08-17 09:54:23
20211202204204	2025-08-17 09:54:23
20211202204605	2025-08-17 09:54:24
20211210212804	2025-08-17 09:54:26
20211228014915	2025-08-17 09:54:27
20220107221237	2025-08-17 09:54:27
20220228202821	2025-08-17 09:54:28
20220312004840	2025-08-17 09:54:28
20220603231003	2025-08-17 09:54:29
20220603232444	2025-08-17 09:54:30
20220615214548	2025-08-17 09:54:31
20220712093339	2025-08-17 09:54:31
20220908172859	2025-08-17 09:54:32
20220916233421	2025-08-17 09:54:33
20230119133233	2025-08-17 09:54:33
20230128025114	2025-08-17 09:54:34
20230128025212	2025-08-17 09:54:35
20230227211149	2025-08-17 09:54:35
20230228184745	2025-08-17 09:54:36
20230308225145	2025-08-17 09:54:37
20230328144023	2025-08-17 09:54:37
20231018144023	2025-08-17 09:54:38
20231204144023	2025-08-17 09:54:39
20231204144024	2025-08-17 09:54:40
20231204144025	2025-08-17 09:54:40
20240108234812	2025-08-17 09:54:41
20240109165339	2025-08-17 09:54:42
20240227174441	2025-08-17 09:54:43
20240311171622	2025-08-17 09:54:44
20240321100241	2025-08-17 09:54:45
20240401105812	2025-08-17 09:54:47
20240418121054	2025-08-17 09:54:48
20240523004032	2025-08-17 09:54:50
20240618124746	2025-08-17 09:54:51
20240801235015	2025-08-17 09:54:51
20240805133720	2025-08-17 09:54:52
20240827160934	2025-08-17 09:54:52
20240919163303	2025-08-17 09:54:53
20240919163305	2025-08-17 09:54:54
20241019105805	2025-08-17 09:54:55
20241030150047	2025-08-17 09:54:57
20241108114728	2025-08-17 09:54:58
20241121104152	2025-08-17 09:54:58
20241130184212	2025-08-17 09:54:59
20241220035512	2025-08-17 09:55:00
20241220123912	2025-08-17 09:55:00
20241224161212	2025-08-17 09:55:01
20250107150512	2025-08-17 09:55:02
20250110162412	2025-08-17 09:55:02
20250123174212	2025-08-17 09:55:03
20250128220012	2025-08-17 09:55:03
20250506224012	2025-08-17 09:55:04
20250523164012	2025-08-17 09:55:05
20250714121412	2025-08-17 09:55:05
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-08-17 09:54:15.96473
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-08-17 09:54:15.976952
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-08-17 09:54:15.987918
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-08-17 09:54:16.05523
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-08-17 09:54:16.241226
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-08-17 09:54:16.244336
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-08-17 09:54:16.249892
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-08-17 09:54:16.253452
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-08-17 09:54:16.255754
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-08-17 09:54:16.258466
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-08-17 09:54:16.261858
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-08-17 09:54:16.265573
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-08-17 09:54:16.28758
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-08-17 09:54:16.293643
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-08-17 09:54:16.297723
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-08-17 09:54:16.367033
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-08-17 09:54:16.369624
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-08-17 09:54:16.372031
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-08-17 09:54:16.375062
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-08-17 09:54:16.381881
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-08-17 09:54:16.384963
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-08-17 09:54:16.389494
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-08-17 09:54:16.407606
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-08-17 09:54:16.419733
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-08-17 09:54:16.422405
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-08-17 09:54:16.4261
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: audit_entries audit_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_entries
    ADD CONSTRAINT audit_entries_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: incident_types incident_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incident_types
    ADD CONSTRAINT incident_types_pkey PRIMARY KEY (id);


--
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: departments_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX departments_code_key ON public.departments USING btree (code);


--
-- Name: incident_types_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX incident_types_name_key ON public.incident_types USING btree (name);


--
-- Name: users_essUserId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_essUserId_key" ON public.users USING btree ("essUserId");


--
-- Name: users_sailPNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_sailPNo_key" ON public.users USING btree ("sailPNo");


--
-- Name: users_ticketNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_ticketNo_key" ON public.users USING btree ("ticketNo");


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: audit_entries audit_entries_incidentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_entries
    ADD CONSTRAINT "audit_entries_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES public.incidents(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: incidents incidents_affectedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT "incidents_affectedUserId_fkey" FOREIGN KEY ("affectedUserId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: incidents incidents_incidentTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT "incidents_incidentTypeId_fkey" FOREIGN KEY ("incidentTypeId") REFERENCES public.incident_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: incidents incidents_requestorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT "incidents_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict z6IslMq7fc06Iz6P9cZ6VA5qEguuKCssOuGD9JeWN0GVeehBJwvigaD8WMXasBw

