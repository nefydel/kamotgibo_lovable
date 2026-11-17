// Facebook sharing for the look-only prototype: a public share link only, no login or API.

export interface SharePost {
  text: string;
  url: string;
}

export function workshopPost(
  w: { title: string; craft: string; town: string; nextDate: string; instructor: string },
  url: string,
): SharePost {
  return {
    url,
    text: `I'm joining "${w.title}" in ${w.town} on ${w.nextDate}! A hands-on ${w.craft.toLowerCase()} workshop with ${w.instructor.replace(" (sample)", "")}, in person. Come learn a local craft with me on KamotGibo. #KamotGibo #Sorsogon`,
  };
}

export function badgePost(
  b: { title: string; issuedBy: string; code: string; skills: string[] },
  url: string,
): SharePost {
  return {
    url,
    text: `I earned the "${b.title}" badge on KamotGibo! ${b.issuedBy.replace(" (sample)", "")} checked my skills in person: ${b.skills.join(", ").toLowerCase()}. Platform skill-verified · code ${b.code}. #KamotGibo #Sorsogon`,
  };
}

export function coursePost(
  c: { title: string; town: string; schedule: string; dates: string },
  url: string,
): SharePost {
  return {
    url,
    text: `I'm enrolling in "${c.title}" in ${c.town} (${c.schedule}, ${c.dates}). In-person upskilling with a local artisan on KamotGibo. #KamotGibo #Sorsogon`,
  };
}

/** Facebook's public share dialog. Facebook may ignore the pre-filled text, so the UI also offers Copy. */
export function facebookShareUrl({ text, url }: SharePost) {
  const params = new URLSearchParams({ u: url, quote: text, hashtag: "#KamotGibo" });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}
