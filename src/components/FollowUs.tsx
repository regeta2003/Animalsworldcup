import { Twitter, Instagram, Youtube, Facebook, Twitch } from "lucide-react";

const IG = "https://www.instagram.com/animalsworldcup";
const YT = "https://www.youtube.com/@animalsworldcup-z4u";

// All channels point to Instagram for now, except YouTube -> the channel.
const socials = [
  { Icon: Instagram, label: "Instagram", href: IG },
  { Icon: Youtube, label: "YouTube", href: YT },
  { Icon: Twitter, label: "X", href: IG },
  { Icon: Facebook, label: "Facebook", href: IG },
  { Icon: Twitch, label: "Twitch", href: IG },
];

export function FollowUs() {
  return (
    <section className="card-surface p-4">
      <h3 className="headline text-base mb-3">Follow Us</h3>
      <div className="grid grid-cols-5 gap-2">
        {socials.map(({ Icon, label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="aspect-square grid place-items-center rounded-xl bg-soft text-ink/70 hover:bg-pitch hover:text-white transition">
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </section>
  );
}
