import { about } from "../utils/tailwindClasses";
import { LinkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Container } from '../components/Container';
import { GitHubIcon } from '../components/SocialIcons';

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <a
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </a>
    </li>
  )
}

export const metadata = {
  title: 'About',
  description:
    'RuneScape Price Tracker is a web application that allows users to track the prices of items in the popular MMORPG RuneScape.',
}

export default function AboutPage() {
  return (
    <div className={about}>
    <Container className="mt-4 sm:mt-8">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            RuneScape Price Tracker
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
                RuneScape Price Tracker is a web application that allows users to track the prices of items in the popular MMORPG RuneScape.
            </p>
          </div>
          <h3 className="mt-6 text-2xl font-bold tracking-tight text-zinc-800 sm:text-2xl dark:text-zinc-100">
            Features Implemented:
          </h3>
          <ul className="mt-4 list-disc list-inside text-base text-zinc-600 dark:text-zinc-400">
            <li>Search for specific items with ease.</li>
            <li>View historical price/volume trends and charts.</li>
            <li>User login system to save your favourites list and track items.</li>
            <li>Alchemy table and item correlation analysis.</li>
            <li>View most popular items among other users.</li>
            <li>Dark mode and light mode support.</li>
          </ul>
          <h3 className="mt-6 text-2xl font-bold tracking-tight text-zinc-800 sm:text-2xl dark:text-zinc-100">
              Components:
            </h3>
            <ul className="mt-4 list-disc list-inside text-base text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Gielinor Index:</strong> Displays an aggregate of 27 key items, summarizing their prices to give an overall market trend.
              </li>
              <li>
                <strong>Volume Leaders:</strong> Highlights the top 10 items with the highest traded daily volume.
              </li>
              <li>
                <strong>Total Views:</strong> Lists the top 10 most-viewed items by users on the website.
              </li>
              <li>
                <strong>Total Favourites:</strong> Shows the top 10 items that users have favourited the most.
              </li>
              <li>
                <strong>Alchemy:</strong> Calculates the margin between the live Grand Exchange price and the fixed alchemy value, helping users identify profitable alchemy opportunities.
              </li>
              <li>
                <strong>Analysis:</strong> Presents a chord diagram illustrating correlations between various items.
              </li>
              <li>
                <strong>Curious:</strong> Displays a random item's price graph for users looking for interesting insights.
              </li>
            </ul>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://github.com/w-foster/sse-team-project-1" icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices"
              icon={LinkIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              RuneScape API
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
    </div>
  )
}