# SupabaseAngular18

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


### Install Supabase
```
npm i @supabase/supabase-js
```

### Create environments
```
ng g environments
```

### Database
<!-- ## Database Table Schema -->
users table

* id (uuid)
* full_name (text)
* avatar_url (text)

Creating a users table

```sql
CREATE TABLE public.users (
   id uuid not null references auth.users on delete cascade,
   full_name text NULL,
   avatar_url text NULL,
   primary key (id)
);
```

Enable Row Level Security

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

Permit Users Access Their Profile

```sql
CREATE POLICY "Permit Users to Access Their Profile"
  ON public.users
  FOR SELECT
  USING ( auth.uid() = id );
```

Permit Users to Update Their Profile

```sql
CREATE POLICY "Permit Users to Update Their Profile"
  ON public.users
  FOR UPDATE
  USING ( auth.uid() = id );
```

Supabase Functions

```sql
CREATE
OR REPLACE FUNCTION public.user_profile() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.users (id, full_name,avatar_url)
VALUES
  (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'::TEXT,
    NEW.raw_user_meta_data ->> 'avatar_url'::TEXT,
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Supabase Trigger

```sql
  CREATE TRIGGER
  create_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.user_profile();
```

Chat_Messages table (Real Time)

* id (uuid)
* Created At (date)
* text (text)
* editable (boolean)
* sender (uuid)