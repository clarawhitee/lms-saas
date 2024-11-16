import { onCreateNewChannel } from "@/actions/channels"
import { onGetGroupChannels } from "@/actions/groups"
import { IGroupInfo, IGroups } from "@/components/global/sidebar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useState, useCallback } from "react"
import { toast } from "sonner"

export const useNavigation = () => {
  const pathName = usePathname()
  const [section, setSection] = useState<string>(pathName)

  const onSetSection = useCallback((page: string) => {
    setSection(page)
  }, [])

  return {
    section,
    onSetSection,
  }
}

export const useSideBar = (groupid: string) => {
  const { data: groups, isLoading: isGroupsLoading, isError: isGroupsError } = useQuery({
    queryKey: ["user-groups"],
    retry: 3, // Retry the query up to 3 times
    staleTime: 60000, // Cache the data for 1 minute
  }) as { data: IGroups }

  const { data: groupInfo, isLoading: isGroupInfoLoading } = useQuery({
    queryKey: ["group-info"],
    retry: 2,
    staleTime: 60000,
  }) as { data: IGroupInfo }

  const { data: channels, isLoading: isChannelsLoading } = useQuery({
    queryKey: ["group-channels"],
    queryFn: () => onGetGroupChannels(groupid),
    staleTime: 60000,
    retry: 2,
  })

  const client = useQueryClient()

  // Optimistic mutation for creating a new channel
  const { isPending, mutate, isError, variables } = useMutation({
    mutationFn: (data: {
      id: string
      name: string
      icon: string
      createdAt: Date
      groupId: string | null
    }) => {
      return onCreateNewChannel(groupid, {
        id: data.id,
        name: data.name.toLowerCase(),
        icon: data.icon,
      })
    },
    onMutate: async (newChannelData) => {
      // Optimistic update: immediately add the new channel to the existing channels
      await client.cancelQueries(["group-channels"])
      const previousChannels = client.getQueryData(["group-channels"])
      client.setQueryData(
        ["group-channels"],
        (oldData: any) => ({
          ...oldData,
          channels: [
            ...(oldData?.channels || []),
            { ...newChannelData, isCreating: true }, // Mark the new channel as being created
          ],
        })
      )

      return { previousChannels }
    },
    onSettled: async () => {
      // Refetch the group channels after mutation
      await client.invalidateQueries({
        queryKey: ["group-channels"],
      })
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update if an error occurs
      if (context?.previousChannels) {
        client.setQueryData(["group-channels"], context.previousChannels)
      }
      toast.error("Error creating channel", {
        description: "Oops! Something went wrong while creating the channel.",
      })
    },
    onSuccess: () => {
      toast.success("Channel created successfully!", {
        description: "The new channel has been added.",
      })
    },
  })

  // Loading, Error and Success Handlers
  if (isGroupsLoading || isGroupInfoLoading || isChannelsLoading) {
    return { isLoading: true, isError: false }
  }

  if (isGroupsError || isChannelsLoading) {
    toast.error("Failed to load data", {
      description: "An error occurred while loading the groups or channels.",
    })
    return { isLoading: false, isError: true }
  }

  return {
    groupInfo,
    groups,
    mutate,
    variables,
    isPending,
    channels,
    isLoading: isGroupsLoading || isGroupInfoLoading || isChannelsLoading,
  }
}
