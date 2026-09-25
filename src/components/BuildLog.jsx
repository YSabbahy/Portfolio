import { useEffect, useState } from "react";
import Reveal from "./Reveal";

const GITHUB_USER = "YSabbahy";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function BuildLog() {
  const [status, setStatus] = useState("loading"); // loading | ok | error | empty
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=6`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const pushEvents = (Array.isArray(data) ? data : [])
          .filter((e) => e.type === "PushEvent" || e.type === "CreateEvent")
          .slice(0, 5);
        if (pushEvents.length === 0) {
          setStatus("empty");
        } else {
          setEvents(pushEvents);
          setStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="section-block px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-16 sm:py-20 md:py-28"
      data-index="07"
      id="build-log"
    >
      <Reveal className="mb-4">
        <span className="section-eyebrow">Live</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
          Recent GitHub activity.
        </h2>
        <p className="text-gray-400 mt-3 max-w-xl">
          Pulled live from the GitHub API — this is real, current activity, not a static list.
        </p>
      </Reveal>
      <Reveal className="buildlog-panel">
        {status === "loading" && (
          <p className="buildlog-msg">Fetching recent activity…</p>
        )}
        {status === "error" && (
          <p className="buildlog-msg">
            Couldn't reach the GitHub API right now.{" "}
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View the profile directly ↗
            </a>
          </p>
        )}
        {status === "empty" && (
          <p className="buildlog-msg">No recent public activity to show right now.</p>
        )}
        {status === "ok" && (
          <ul className="buildlog-list">
            {events.map((event) => (
              <li className="buildlog-item" key={event.id}>
                <span className="buildlog-dot" aria-hidden="true" />
                <div>
                  <span className="buildlog-repo">{event.repo?.name}</span>
                  <span className="buildlog-type">
                    {event.type === "PushEvent" ? " — pushed commits" : " — created"}
                  </span>
                </div>
                <span className="buildlog-time">{timeAgo(event.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
