drop policy "allow_anon_insert_leads" on "public"."leads";

drop policy "allow_auth_all_leads" on "public"."leads";

drop policy "anon_insert_leads" on "public"."leads";

drop policy "auth_all_leads" on "public"."leads";

revoke delete on table "public"."leads" from "anon";

revoke insert on table "public"."leads" from "anon";

revoke references on table "public"."leads" from "anon";

revoke select on table "public"."leads" from "anon";

revoke trigger on table "public"."leads" from "anon";

revoke truncate on table "public"."leads" from "anon";

revoke update on table "public"."leads" from "anon";

revoke delete on table "public"."leads" from "authenticated";

revoke insert on table "public"."leads" from "authenticated";

revoke references on table "public"."leads" from "authenticated";

revoke select on table "public"."leads" from "authenticated";

revoke trigger on table "public"."leads" from "authenticated";

revoke truncate on table "public"."leads" from "authenticated";

revoke update on table "public"."leads" from "authenticated";

revoke delete on table "public"."leads" from "service_role";

revoke insert on table "public"."leads" from "service_role";

revoke references on table "public"."leads" from "service_role";

revoke select on table "public"."leads" from "service_role";

revoke trigger on table "public"."leads" from "service_role";

revoke truncate on table "public"."leads" from "service_role";

revoke update on table "public"."leads" from "service_role";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_age(birth_date date)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_lead_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- If first_name and last_name are provided, combine them for the name field
    IF NEW.first_name IS NOT NULL AND NEW.last_name IS NOT NULL THEN
        NEW.name = CONCAT(NEW.first_name, ' ', NEW.last_name);
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$
;


