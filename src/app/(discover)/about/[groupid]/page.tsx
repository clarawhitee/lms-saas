import { onAuthenticatedUser } from "@/actions/auth"
import { onGetGroupInfo } from "@/actions/groups"
import { onGetActiveSubscription } from "@/actions/payments"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import AboutGroup from "../_components/about"
import GroupSideWidget from "@/components/global/group-side-widget"

type Props = {
  params: {
    groupid: string
  }
}

const Page = async ({ params }: Props) => {
  const query = new QueryClient()

  // Prefetching the required data for a smooth experience
  await query.prefetchQuery({
    queryKey: ["about-group-info"],
    queryFn: () => onGetGroupInfo(params.groupid),
  })

  await query.prefetchQuery({
    queryKey: ["active-subscription"],
    queryFn: () => onGetActiveSubscription(params.groupid),
  })

  // Fetch authenticated user information for personalized experience
  const userid = await onAuthenticatedUser()

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="pt-36 pb-10 container grid grid-cols-1 lg:grid-cols-3 gap-x-10">
        {/* Main content section */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 rounded-2xl shadow-xl backdrop-blur-md transition-all ease-in-out duration-500">
          {/* About Group Component */}
          <AboutGroup userid={userid.id!} groupid={params.groupid} />
        </div>

        {/* Sidebar section with modern UI */}
        <div className="col-span-1 relative bg-gradient-to-t from-gray-800 via-gray-900 to-black p-5 rounded-2xl shadow-xl backdrop-blur-md transition-all ease-in-out duration-500">
          <GroupSideWidget userid={userid.id} groupid={params.groupid} />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Page
