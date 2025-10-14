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

CREATE OR REPLACE FUNCTION public.update_tcpa_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- If tcpa_consent is being set to true and timestamp is null, set current timestamp
  IF NEW.tcpa_consent = true AND (OLD.tcpa_consent = false OR OLD.tcpa_consent IS NULL) THEN
    NEW.tcpa_consent_timestamp = timezone('utc'::text, now());
  END IF;
  
  -- If tcpa_consent is being set to false, clear the timestamp
  IF NEW.tcpa_consent = false THEN
    NEW.tcpa_consent_timestamp = NULL;
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


