"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import css from "./SidebarNotes.module.css";

const tags = ["Work", "Personal", "Todo", "Meeting", "Shopping"];

export default function SidebarNotes() {
  const pathname = usePathname();

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link
          href="/notes/filter/all"
          className={
            pathname === "/notes/filter/all"
              ? `${css.menuLink} ${css.active}`
              : css.menuLink
          }
        >
          All notes
        </Link>
      </li>

      {tags.map((tag) => {
        const href = `/notes/filter/${tag}`;

        return (
          <li key={tag} className={css.menuItem}>
            <Link
              href={href}
              className={
                pathname === href
                  ? `${css.menuLink} ${css.active}`
                  : css.menuLink
              }
            >
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
