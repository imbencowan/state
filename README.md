# State

`State` is a local PHP/MariaDB app I built to track the events my company runs for Idaho high school state championships.

The main problem it solves is shirt-order tracking. For each event, qualifying schools send email attachments with auto-generated `.txt` files listing the shirt sizes their teams need. This app helps me get that information into a database so I can track, edit, print, and manage those orders in one place.

At the moment, I am the only developer and the only user. This README is mainly for future me and for anyone else trying to understand the project quickly.

## What the app does

The most-used part of the app is the events/orders workflow. In practice, the app lets me:

- view shirt orders for events
- edit or add to those orders
- mark orders complete
- print labels
- see how many more shirts are needed for incomplete orders
- track when an order exceeds the quantity a school qualified for

The app also includes support for:

- scheduling employees for events
- tracking inventory taken to events

Planned future work includes reporting for past events.

## Current environment

This project currently runs locally on my laptop through XAMPP.

- PHP: XAMPP PHP `8.2.12`
- Database: MariaDB
- Web server: Apache via XAMPP

The codebase includes PHP 8.1-era features and is working in my current XAMPP setup.

## Local setup

This is the current practical setup process:

1. Put the repo in the XAMPP web root, currently `C:\xampp\htdocs\state`.
2. Start Apache and MariaDB from XAMPP.
3. Create or import the MariaDB database used by the app.
4. Make sure the app's database connection settings match the local environment.
5. Open the app in the browser from the local XAMPP URL.

This project is not yet packaged for clean public deployment. Local XAMPP usage is the intended workflow for now.

## Architecture notes

The project started with an MVC-style structure, because that was the pattern I originally learned and started from. Parts of that structure are still visible in files and folders like:

- `index.php`
- `controller.php`
- `model/`
- `view/`

Over time, the app has moved toward more interactive, JavaScript-driven pages. That shift happened because the core workflows are not really static page rendering problems. They involve editing, dynamic updates, and reusable display logic in the browser.

That migration is still in progress. The long-term direction is likely to reduce or remove the PHP view layer in `view/` in favor of more reusable frontend rendering and interaction code.

## Project shape

At a high level:

- `index.php` provides the main page shell
- `controller.php` receives requests and dispatches actions
- `model/` contains the database-backed domain classes
- `view/` contains PHP-rendered partials used by the current UI
- `scripts/` contains frontend JavaScript, including page-specific behavior

## Status

This is an active internal tool, not a polished product.

It is designed around real day-to-day use rather than public distribution, and parts of it are still evolving as the workflows become clearer. The events/orders flow is the center of the app and the part that matters most.
