import { Heading, Text } from '../views'

import style from './main.module.css'

export function MainLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <header className={style.header}>
        <Heading level={'1'} withColor='light' withSize='regular'>Change the weather</Heading>
      </header>

      <main className={style.main}>
        { children }
      </main>

      <footer className={style.footer}>
        <Text withColor='light'>2023, <a href='https://github.com/51ned/2023_weather' target='_blanc'>Github</a></Text>
      </footer>
    </>
  )
}