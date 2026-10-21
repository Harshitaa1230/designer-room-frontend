import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import {
  createRoadmap,
  createTopic,
  deleteRoadmap,
  deleteTopic,
  getRoadmap,
  listRoadmaps,
  updateRoadmap,
  updateTopic,
} from '@/lib/endpoints'
import { messageOf, statusOf } from '@/lib/api'
import { AuthorizationError } from '@/components/AuthorizationError'
import { Spinner } from '@/components/LoadingState'

const inputClasses =
  'w-full rounded-lg border border-[#302923] bg-[#0b0a09] px-3 py-2 text-sm text-white placeholder-[#57504a] transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none'

const smallButtonClasses =
  'inline-flex items-center gap-1.5 rounded-full border border-[#302923] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50'

interface AdminPageProps {
  onForbidden: (message: string) => void
  onActionError: (message: string) => void
}

function TopicRow({
  roadmapId,
  topic,
  onForbidden,
  onActionError,
}: AdminPageProps & { roadmapId: string; topic: { id: string; title: string; description: string | null; position: number } }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(topic.title)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId] })
    void queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
  }

  const handleError = (error: unknown) => {
    if (statusOf(error) === 403) onForbidden('This action requires administrator access. Your account is not an admin.')
    else onActionError(messageOf(error, 'The topic update failed.'))
  }

  const update = useMutation({
    mutationFn: (title: string) => updateTopic(topic.id, { title }),
    onSuccess: () => {
      setEditing(false)
      invalidate()
    },
    onError: handleError,
  })

  const remove = useMutation({
    mutationFn: () => deleteTopic(topic.id),
    onSuccess: () => {
      setConfirmDelete(false)
      invalidate()
    },
    onError: handleError,
  })

  if (editing) {
    return (
      <li className="flex items-center gap-2">
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            const next = draft.trim()
            if (next && next !== topic.title) update.mutate(next)
            else setEditing(false)
          }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={200}
            className={inputClasses}
          />
          <button
            type="submit"
            disabled={update.isPending || !draft.trim()}
            aria-label="Save topic"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,106,26,0.4)] text-[#ff8a4a] transition-colors hover:bg-[rgba(255,106,26,0.12)] disabled:opacity-40"
          >
            {update.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => {
              setDraft(topic.title)
              setEditing(false)
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#302923] text-[#827a73] transition-colors hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
      </li>
    )
  }

  if (confirmDelete) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.06)] px-3 py-2">
        <span className="text-xs text-[#ff8a4a]">
          Delete topic “{topic.title}”? This cannot be undone.
        </span>
        <span className="flex gap-3">
          <button
            type="button"
            disabled={remove.isPending}
            onClick={() => remove.mutate()}
            className="text-xs font-semibold text-white underline underline-offset-2 hover:text-[#ff8a4a] disabled:opacity-60"
          >
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="text-xs text-[#827a73] hover:text-white"
          >
            Cancel
          </button>
        </span>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="min-w-0 truncate text-sm text-[#b6ada4]">{topic.title}</span>
      <span className="flex shrink-0 gap-1">
        <button
          type="button"
          aria-label={`Edit topic ${topic.title}`}
          onClick={() => {
            setDraft(topic.title)
            setEditing(true)
          }}
          className="flex size-7 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Delete topic ${topic.title}`}
          onClick={() => setConfirmDelete(true)}
          className="flex size-7 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-[rgba(255,60,0,0.12)] hover:text-[#ff8a4a]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </span>
    </li>
  )
}

function RoadmapAdminCard({
  roadmap,
  onForbidden,
  onActionError,
}: AdminPageProps & { roadmap: { id: string; title: string; description: string | null } }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(roadmap.title)
  const [descDraft, setDescDraft] = useState(roadmap.description ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [topicTitle, setTopicTitle] = useState('')
  const [topicDesc, setTopicDesc] = useState('')

  const handleError = (error: unknown) => {
    if (statusOf(error) === 403)
      onForbidden('This action requires administrator access. Your account is not an admin.')
    else onActionError(messageOf(error, 'The update failed.'))
  }

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
    void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmap.id] })
  }

  const detail = useQuery({
    queryKey: ['roadmap', roadmap.id],
    queryFn: () => getRoadmap(roadmap.id),
    enabled: open,
  })

  const update = useMutation({
    mutationFn: () =>
      updateRoadmap(roadmap.id, { title: titleDraft.trim(), description: descDraft.trim() || undefined }),
    onSuccess: () => {
      setEditing(false)
      invalidate()
    },
    onError: handleError,
  })

  const remove = useMutation({
    mutationFn: () => deleteRoadmap(roadmap.id),
    onSuccess: invalidate,
    onError: handleError,
  })

  const addTopic = useMutation({
    mutationFn: () =>
      createTopic(roadmap.id, {
        title: topicTitle.trim(),
        description: topicDesc.trim() || undefined,
      }),
    onSuccess: () => {
      setTopicTitle('')
      setTopicDesc('')
      invalidate()
    },
    onError: handleError,
  })

  return (
    <article className="rounded-[20px] border border-[#302923] bg-[#11100f]">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-white">{roadmap.title}</h3>
          {roadmap.description && !editing && (
            <p className="mt-0.5 line-clamp-1 text-sm text-[#b6ada4]">{roadmap.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTitleDraft(roadmap.title)
              setDescDraft(roadmap.description ?? '')
              setEditing((v) => !v)
            }}
            className={smallButtonClasses}
          >
            {editing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
          {confirmDelete ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.08)] px-3 py-1.5">
              <span className="text-xs text-[#ff8a4a]">Delete this roadmap and all its topics?</span>
              <button
                type="button"
                disabled={remove.isPending}
                onClick={() => remove.mutate()}
                className="text-xs font-semibold text-white underline underline-offset-2 hover:text-[#ff8a4a] disabled:opacity-60"
              >
                {remove.isPending ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[#827a73] hover:text-white"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={remove.isPending}
              className={`${smallButtonClasses} hover:border-[rgba(255,60,0,0.5)] hover:text-[#ff8a4a]`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>

      {editing && (
        <form
          className="flex flex-col gap-3 border-t border-[#302923] p-5"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            if (titleDraft.trim()) update.mutate()
          }}
        >
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            maxLength={200}
            placeholder="Roadmap title"
            className={inputClasses}
          />
          <textarea
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="Description (optional)"
            className={`${inputClasses} resize-y`}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={update.isPending || !titleDraft.trim() || titleDraft.trim() === roadmap.title}
              className={`${smallButtonClasses} border-[rgba(255,106,26,0.4)] text-[#ff8a4a] hover:bg-[rgba(255,106,26,0.1)]`}
            >
              {update.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              Save changes
            </button>
            {update.isError && (
              <span className="text-xs text-[#ff8a4a]">{messageOf(update.error, 'Save failed.')}</span>
            )}
          </div>
        </form>
      )}

      <div className="border-t border-[#302923]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-[#b6ada4] transition-colors hover:text-white"
        >
          Topics
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="space-y-3 px-5 pb-5">
            {detail.isPending ? (
              <div className="flex items-center gap-2 py-2 text-xs text-[#827a73]">
                <Spinner /> Loading topics…
              </div>
            ) : detail.isError ? (
              <p className="py-2 text-xs text-[#ff8a4a]">
                {messageOf(detail.error, 'Could not load topics.')}
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {detail.data.topics.length === 0 && (
                  <li className="px-3 py-2 text-xs text-[#827a73]">No topics yet.</li>
                )}
                {detail.data.topics.map((topic) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    roadmapId={roadmap.id}
                    onForbidden={onForbidden}
                    onActionError={onActionError}
                  />
                ))}
              </ul>
            )}

            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
                if (topicTitle.trim()) addTopic.mutate()
              }}
            >
              <input
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                maxLength={200}
                placeholder="New topic title"
                className={`${inputClasses} sm:max-w-[240px]`}
              />
              <input
                value={topicDesc}
                onChange={(e) => setTopicDesc(e.target.value)}
                maxLength={500}
                placeholder="Topic description (optional)"
                className={inputClasses}
              />
              <button
                type="submit"
                disabled={addTopic.isPending || !topicTitle.trim()}
                className={`${smallButtonClasses} shrink-0 justify-center border-[rgba(255,106,26,0.4)] text-[#ff8a4a] hover:bg-[rgba(255,106,26,0.1)]`}
              >
                {addTopic.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                Add topic
              </button>
            </form>
            {addTopic.isError && (
              <p className="text-xs text-[#ff8a4a]">{messageOf(addTopic.error, 'Adding the topic failed.')}</p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export function AdminPage() {
  const queryClient = useQueryClient()
  const [forbidden, setForbidden] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const roadmaps = useQuery({
    queryKey: ['roadmaps', 'admin'],
    queryFn: () => listRoadmaps({ limit: 50 }),
    retry: (failureCount, error) => statusOf(error) !== 403 && failureCount < 2,
  })

  const onForbidden = (message: string) => setForbidden(message)
  const onActionError = (message: string) => setActionError(message)

  const create = useMutation({
    mutationFn: () => createRoadmap({ title: title.trim(), description: description.trim() || undefined }),
    onSuccess: () => {
      setTitle('')
      setDescription('')
      void queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
    },
    onError: (error) => {
      if (statusOf(error) === 403)
        onForbidden('This action requires administrator access. Your account is not an admin.')
      else onActionError(messageOf(error, 'Creating the roadmap failed.'))
    },
  })

  if (forbidden) {
    return (
      <div className="px-6 pt-28 pb-16 sm:px-10 md:px-16">
        <div className="mx-auto max-w-3xl">
          <AuthorizationError message={forbidden} />
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pt-28 pb-16 sm:px-10 md:px-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-tight font-medium tracking-[-0.03em] text-white sm:text-[38px]">
            Roadmap manager
          </h1>
          <p className="max-w-[56ch] text-[15px] leading-relaxed text-[#b6ada4]">
            Create roadmaps, edit what is live, and arrange the topics inside each path.
          </p>
        </header>

        {actionError && (
          <p
            role="alert"
            className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(255,106,26,0.35)] bg-[rgba(255,106,26,0.08)] px-4 py-3 text-sm text-[#ff8a4a]"
          >
            {actionError}
            <button
              type="button"
              onClick={() => setActionError(null)}
              aria-label="Dismiss error"
              className="text-[#827a73] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </p>
        )}

        {/* Create */}
        <section className="rounded-[20px] border border-[#302923] bg-[#11100f] p-6">
          <h2 className="mb-4 text-base font-medium text-white">New roadmap</h2>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              if (title.trim()) create.mutate()
            }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Roadmap title"
              className={inputClasses}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Description (optional)"
              className={`${inputClasses} resize-y`}
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={create.isPending || !title.trim()}
                className={`${smallButtonClasses} border-[rgba(255,106,26,0.4)] text-[#ff8a4a] hover:bg-[rgba(255,106,26,0.1)]`}
              >
                {create.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                Create roadmap
              </button>
              {create.isError && (
                <span className="text-xs text-[#ff8a4a]">{messageOf(create.error, 'Creation failed.')}</span>
              )}
            </div>
          </form>
        </section>

        {/* List */}
        <section>
          <h2 className="mb-3 text-base font-medium text-white">Roadmaps</h2>
          {roadmaps.isPending ? (
            <div className="flex items-center gap-2 rounded-[20px] border border-[#302923] bg-[#11100f] p-6 text-sm text-[#827a73]">
              <Spinner /> Loading roadmaps…
            </div>
          ) : roadmaps.isError ? (
            statusOf(roadmaps.error) === 403 ? (
              <AuthorizationError message="Listing roadmaps as an admin was denied by the server." />
            ) : (
              <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#302923] bg-[#11100f] p-6">
                <p className="text-sm text-[#ff8a4a]">
                  {messageOf(roadmaps.error, 'Could not load roadmaps.')}
                </p>
                <button
                  type="button"
                  onClick={() => void roadmaps.refetch()}
                  className={smallButtonClasses}
                >
                  Try again
                </button>
              </div>
            )
          ) : roadmaps.data.items.length === 0 ? (
            <p className="rounded-[20px] border border-[#302923] bg-[#11100f] p-6 text-sm text-[#827a73]">
              Nothing here yet — create the first roadmap above.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {roadmaps.data.items.map((roadmap) => (
                <RoadmapAdminCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  onForbidden={onForbidden}
                  onActionError={onActionError}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
