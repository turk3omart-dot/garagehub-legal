#!/usr/bin/env python3
"""Fill in the GarageHub website's publishing details, then check nothing is left over.

Usage (from the garagehub-legal folder):
    python3 tools/fill-details.py            # asks for each value
    python3 tools/fill-details.py --check    # only reports placeholders that remain

It replaces these placeholders in every .html file:
    {{SUPPORT_EMAIL}}       e.g. support@example.com
    {{DEVELOPER_NAME}}      your name or your registered business name, exactly as you want it shown
    {{EFFECTIVE_DATE_EN}}   written from the date you enter, e.g. 1 November 2026
    {{EFFECTIVE_DATE_AR}}   e.g. 1 نوفمبر 2026 (Western digits, like the app)
"""
import datetime
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PATTERN = re.compile(r"\{\{[A-Z_]+\}\}")
MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July",
             "August", "September", "October", "November", "December"]
MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو",
             "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]


def html_files():
    return sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)


def leftovers():
    found = []
    for path in html_files():
        for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            for match in PATTERN.findall(line):
                found.append(f"{path.relative_to(ROOT)}:{n}  {match}")
    return found


def ask(prompt, check):
    while True:
        value = input(prompt).strip()
        error = check(value)
        if not error:
            return value
        print("  " + error)


def main():
    if "--check" not in sys.argv:
        email = ask("Support email: ", lambda v: None if re.fullmatch(r"[^@\s<>\"]+@[^@\s<>\"]+\.[A-Za-z]{2,}", v)
                    else "That doesn't look like an email address.")
        name = ask("Developer name (as shown publicly): ", lambda v: None if v and "<" not in v and "{" not in v
                   else "Please enter a name (no < or { characters).")
        date_text = ask("Effective date (YYYY-MM-DD, empty for today): ", lambda v: None if not v or re.fullmatch(r"\d{4}-\d{2}-\d{2}", v)
                        else "Use the form 2026-11-01.")
        date = datetime.date.fromisoformat(date_text) if date_text else datetime.date.today()
        values = {
            "{{SUPPORT_EMAIL}}": email,
            "{{DEVELOPER_NAME}}": name.replace("&", "&amp;"),
            "{{EFFECTIVE_DATE_EN}}": f"{date.day} {MONTHS_EN[date.month - 1]} {date.year}",
            "{{EFFECTIVE_DATE_AR}}": f"{date.day} {MONTHS_AR[date.month - 1]} {date.year}",
        }
        for path in html_files():
            text = path.read_text(encoding="utf-8")
            updated = text
            for key, value in values.items():
                updated = updated.replace(key, value)
            if updated != text:
                path.write_text(updated, encoding="utf-8")
                print(f"Updated {path.relative_to(ROOT)}")

    remaining = leftovers()
    if remaining:
        print("\nPlaceholders still to fill:")
        print("\n".join("  " + r for r in remaining))
        sys.exit(1)
    print("\nAll details are filled in. The site is ready to publish.")


if __name__ == "__main__":
    main()
