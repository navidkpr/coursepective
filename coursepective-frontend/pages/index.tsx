import type { ReactElement } from 'react'
import Layout from '../components/Layout'
import Search from '../components/Search'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return (<div className='h-[90vh] flex justify-center items-center'><Search /></div>)
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Page