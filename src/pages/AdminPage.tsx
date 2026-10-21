import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, FileUp, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import {
  createCheckpoint,
  createRoadmap,
  createStage,
  createTopic,
  deleteCheckpoint,
  deleteRoadmap,
  deleteStage,
  deleteTopic,
  deleteTopicContent,
  getRoadmap,
  listRoadmaps,
  updateCheckpoint,
  updateRoadmap,
  updateStage,
  updateTopic,
  uploadTopicContent,
  type Checkpoint,
  type Difficulty,
  type RoadmapSummary,
  type Stage,
  type Topic,
} from '@/lib/endpoints'
import { messageOf, statusOf } from '@/lib/api'
import { AuthorizationError } from '@/components/AuthorizationError'
import { Spinner } from '@/components/LoadingState'

const inputClasses =
  'w-full rounded-lg border border-[#302923] bg-[#0b0a09] px-3 py-2 text-sm text-white placeholder-[#57504a] transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none'

const smallButtonClasses =
  'inline-flex items-center gap-1.5 rounded-full border border-[#302923] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50'

const accentButtonClasses = `${smallButtonClasses} border-[rgba(255,106,26,0.4)] text-[#ff8a4a] hover:bg-[rgba(255,106,26,0.1)]`

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced']

interface AdminPageProps {
  onForbidden: (message: string) => void
  onActionError: (message: string) => void
}

function useAdminErrors(onForbidden: (message: string) => void, onActionError: (message: string) => void) {
  return (error: unknown, fallback: string) => {
    if (statusOf(error) === 403) {
      onForbidden('This action requires administrator access. Your account is not an admin.')
    } else {
      onActionError(messageOf(error, fallback))
    }
  }
}

// ── Topic ───────────────────────────────────────────────────────────────────

function TopicRow({
  roadmapId,
  topic,
  stages,
  onForbidden,
  onActionError,
}: AdminPageProps & { roadmapId: string; topic: Topic; stages: Stage[] }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(topic.title)
  const [stageDraft, setStageDraft] = useState<string>(topic.stage === null ? '' : String(topic.stage))
  const [difficultyDraft, setDifficultyDraft] = useState<string>(topic.difficulty ?? 'beginner')
  const [minutesDraft, setMinutesDraft] = useState<string>(
    topic.estimatedMinutes === null ? '' : String(topic.estimatedMinutes),
  )
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleError = useAdminErrors(onForbidden, onActionError)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId] })
    void queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
  }

  const update = useMutation({
    mutationFn: () =>
      updateTopic(topic.id, {
        title: titleDraft.trim(),
        stage: stageDraft === '' ? null : Number(stageDraft),
        difficulty: difficultyDraft as Difficulty,
        estimatedMinutes: minutesDraft === '' ? undefined : Number(minutesDraft),
      }),
    onSuccess: () => {
      setEditing(false)
      invalidate()
    },
    onError: (error) => handleError(error, 'The topic update failed.'),
  })

  const remove = useMutation({
    mutationFn: () => deleteTopic(topic.id),
    onSuccess: () => {
      setConfirmDelete(false)
      invalidate()
    },
    onError: (error) => handleError(error, 'Deleting the topic failed.'),
  })

  const upload = useMutation({
    mutationFn: (file: File) => uploadTopicContent(roadmapId, topic.id, file),
    onSuccess: () => {
      setFileError(null)
      invalidate()
    },
    onError: (error) => handleError(error, 'Uploading the document failed.'),
  })

  const removeDocument = useMutation({
    mutationFn: () => deleteTopicContent(roadmapId, topic.id),
    onSuccess: invalidate,
    onError: (error) => handleError(error, 'Deleting the document failed.'),
  })

  if (editing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-[#302923] bg-[#0b0a09] p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            maxLength={200}
            className={inputClasses}
          />
          <select
            value={stageDraft}
            onChange={(e) => setStageDraft(e.target.value)}
            aria-label="Stage"
            className={`${inputClasses} sm:max-w-[150px]`}
          >
            <option value="">No stage</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.position}>
                Stage {stage.position} — {stage.title}
              </option>
            ))}
          </select>
          <select
            value={difficultyDraft}
            onChange={(e) => setDifficultyDraft(e.target.value)}
            aria-label="Difficulty"
            className={`${inputClasses} sm:max-w-[140px]`}
          >
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <input
            value={minutesDraft}
            onChange={(e) => setMinutesDraft(e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            placeholder="min"
            aria-label="Estimated minutes"
            className={`${inputClasses} sm:max-w-[90px]`}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={update.isPending || !titleDraft.trim()}
            onClick={() => update.mutate()}
            className={accentButtonClasses}
          >
            {update.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            Save topic
          </button>
          <button
            type="button"
            onClick={() => {
              setTitleDraft(topic.title)
              setStageDraft(topic.stage === null ? '' : String(topic.stage))
              setDifficultyDraft(topic.difficulty ?? 'beginner')
              setMinutesDraft(topic.estimatedMinutes === null ? '' : String(topic.estimatedMinutes))
              setEditing(false)
            }}
            className={smallButtonClasses}
          >
            Cancel
          </button>
          {update.isError && (
            <span className="text-xs text-[#ff8a4a]">{messageOf(update.error, 'Save failed.')}</span>
          )}
        </div>
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
    <li className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm text-[#b6ada4]">{topic.title}</span>
        <span className="text-[11px] text-[#827a73]">
          {topic.stage === null ? 'No stage' : `Stage ${topic.stage}`} · {topic.difficulty ?? 'beginner'}
          {topic.estimatedMinutes ? ` · ${topic.estimatedMinutes} min` : ''} ·{' '}
          {topic.hasContent ? 'document uploaded' : 'no document'}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <label
          className={`${smallButtonClasses} cursor-pointer`}
          title="Upload a Markdown document"
        >
          {upload.isPending ? (
            <Spinner className="h-3.5 w-3.5" />
          ) : (
            <FileUp className="h-3.5 w-3.5" />
          )}
          {topic.hasContent ? 'Replace' : 'Upload'}
          <input
            type="file"
            accept=".md,.markdown,text/markdown"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              if (!/\.(md|markdown)$/i.test(file.name)) {
                setFileError('Only .md or .markdown files are accepted.')
                return
              }
              setFileError(null)
              upload.mutate(file)
            }}
          />
        </label>
        {topic.hasContent && (
          <button
            type="button"
            aria-label={`Delete the document of ${topic.title}`}
            disabled={removeDocument.isPending}
            onClick={() => removeDocument.mutate()}
            className="flex size-7 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-[rgba(255,60,0,0.12)] hover:text-[#ff8a4a]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          aria-label={`Edit topic ${topic.title}`}
          onClick={() => setEditing(true)}
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
      {fileError && <span className="w-full text-xs text-[#ff8a4a]">{fileError}</span>}
      {upload.isError && (
        <span className="w-full text-xs text-[#ff8a1a]">{messageOf(upload.error, 'Upload failed.')}</span>
      )}
    </li>
  )
}

// ── Checkpoint ──────────────────────────────────────────────────────────────

function CheckpointRow({
  roadmapId,
  checkpoint,
  onForbidden,
  onActionError,
}: AdminPageProps & { roadmapId: string; checkpoint: Checkpoint }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [taskDraft, setTaskDraft] = useState(checkpoint.task)
  const [timeDraft, setTimeDraft] = useState(checkpoint.timeEstimate ?? '')

  const handleError = useAdminErrors(onForbidden, onActionError)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId] })
  }

  const update = useMutation({
    mutationFn: () =>
      updateCheckpoint(checkpoint.id, {
        task: taskDraft.trim(),
        timeEstimate: timeDraft.trim() || undefined,
      }),
    onSuccess: () => {
      setEditing(false)
      invalidate()
    },
    onError: (error) => handleError(error, 'The checkpoint update failed.'),
  })

  const remove = useMutation({
    mutationFn: () => deleteCheckpoint(checkpoint.id),
    onSuccess: invalidate,
    onError: (error) => handleError(error, 'Deleting the checkpoint failed.'),
  })

  if (editing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-[#302923] bg-[#0b0a09] p-2 sm:flex-row sm:items-center">
        <input
          autoFocus
          value={taskDraft}
          onChange={(e) => setTaskDraft(e.target.value)}
          maxLength={300}
          className={inputClasses}
        />
        <input
          value={timeDraft}
          onChange={(e) => setTimeDraft(e.target.value)}
          maxLength={50}
          placeholder="2–3 hrs"
          className={`${inputClasses} sm:max-w-[110px]`}
        />
        <button
          type="button"
          disabled={update.isPending || !taskDraft.trim()}
          onClick={() => update.mutate()}
          aria-label="Save checkpoint"
          className={`${accentButtonClasses} shrink-0 justify-center`}
        >
          {update.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setTaskDraft(checkpoint.task)
            setTimeDraft(checkpoint.timeEstimate ?? '')
            setEditing(false)
          }}
          aria-label="Cancel"
          className={`${smallButtonClasses} shrink-0 justify-center`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-3 px-3 py-1.5">
      <span className="min-w-0 flex-1 truncate text-xs text-[#b6ada4]">{checkpoint.task}</span>
      {checkpoint.timeEstimate && (
        <span className="shrink-0 text-[11px] text-[#827a73]">{checkpoint.timeEstimate}</span>
      )}
      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Edit checkpoint ${checkpoint.task}`}
          onClick={() => setEditing(true)}
          className="flex size-6 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          type="button"
          disabled={remove.isPending}
          aria-label={`Delete checkpoint ${checkpoint.task}`}
          onClick={() => remove.mutate()}
          className="flex size-6 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-[rgba(255,60,0,0.12)] hover:text-[#ff8a4a]"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </span>
    </li>
  )
}

// ── Stage ────────────────────────────────────────────────────────────────────

function StageRow({
  roadmapId,
  stage,
  onForbidden,
  onActionError,
}: AdminPageProps & { roadmapId: string; stage: Stage }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(stage.title)
  const [subtitleDraft, setSubtitleDraft] = useState(stage.subtitle ?? '')
  const [byTheEndDraft, setByTheEndDraft] = useState(stage.byTheEnd ?? '')
  const [weekDraft, setWeekDraft] = useState(stage.weekLabel ?? '')
  const [positionDraft, setPositionDraft] = useState(String(stage.position))
  const [prerequisiteDraft, setPrerequisiteDraft] = useState(
    stage.prerequisiteStage === null ? '' : String(stage.prerequisiteStage),
  )
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [taskDraft, setTaskDraft] = useState('')
  const [timeDraft, setTimeDraft] = useState('')

  const handleError = useAdminErrors(onForbidden, onActionError)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId] })
    void queryClient.invalidateQueries({ queryKey: ['roadmaps'] })
  }

  const update = useMutation({
    mutationFn: () =>
      updateStage(stage.id, {
        title: titleDraft.trim(),
        subtitle: subtitleDraft.trim() || undefined,
        byTheEnd: byTheEndDraft.trim() || undefined,
        weekLabel: weekDraft.trim() || undefined,
        position: Number(positionDraft),
        prerequisiteStage: prerequisiteDraft === '' ? null : Number(prerequisiteDraft),
      }),
    onSuccess: () => {
      setEditing(false)
      invalidate()
    },
    onError: (error) => handleError(error, 'The stage update failed.'),
  })

  const remove = useMutation({
    mutationFn: () => deleteStage(stage.id),
    onSuccess: () => {
      setConfirmDelete(false)
      invalidate()
    },
    onError: (error) => handleError(error, 'Deleting the stage failed.'),
  })

  const addCheckpoint = useMutation({
    mutationFn: () =>
      createCheckpoint(stage.id, {
        task: taskDraft.trim(),
        timeEstimate: timeDraft.trim() || undefined,
      }),
    onSuccess: () => {
      setTaskDraft('')
      setTimeDraft('')
      invalidate()
    },
    onError: (error) => handleError(error, 'Adding the checkpoint failed.'),
  })

  return (
    <li className="rounded-xl border border-[#302923] bg-[#0b0a09] p-3">
      {editing ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              maxLength={200}
              placeholder="Stage title"
              className={`${inputClasses} sm:max-w-[220px]`}
            />
            <input
              value={positionDraft}
              onChange={(e) => setPositionDraft(e.target.value.replace(/[^0-9]/g, ''))}
              inputMode="numeric"
              aria-label="Stage position"
              className={`${inputClasses} sm:max-w-[80px]`}
            />
            <input
              value={prerequisiteDraft}
              onChange={(e) => setPrerequisiteDraft(e.target.value.replace(/[^0-9]/g, ''))}
              inputMode="numeric"
              placeholder="prereq"
              aria-label="Prerequisite stage"
              className={`${inputClasses} sm:max-w-[90px]`}
            />
          </div>
          <input
            value={subtitleDraft}
            onChange={(e) => setSubtitleDraft(e.target.value)}
            maxLength={300}
            placeholder="Subtitle"
            className={inputClasses}
          />
          <input
            value={byTheEndDraft}
            onChange={(e) => setByTheEndDraft(e.target.value)}
            maxLength={300}
            placeholder="By the end you will…"
            className={inputClasses}
          />
          <input
            value={weekDraft}
            onChange={(e) => setWeekDraft(e.target.value)}
            maxLength={60}
            placeholder="Week label"
            className={inputClasses}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={update.isPending || !titleDraft.trim()}
              onClick={() => update.mutate()}
              className={accentButtonClasses}
            >
              {update.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              Save stage
            </button>
            <button type="button" onClick={() => setEditing(false)} className={smallButtonClasses}>
              Cancel
            </button>
            {update.isError && (
              <span className="text-xs text-[#ff8a4a]">
                {messageOf(update.error, 'Save failed.')}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm text-white">
              {stage.position}. {stage.title}
            </span>
            <span className="text-[11px] text-[#827a73]">
              {stage.subtitle ?? 'No subtitle'}
              {stage.prerequisiteStage ? ` · needs stage ${stage.prerequisiteStage}` : ''}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={`Edit stage ${stage.title}`}
              onClick={() => setEditing(true)}
              className="flex size-7 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Delete stage ${stage.title}`}
              onClick={() => setConfirmDelete(true)}
              className="flex size-7 items-center justify-center rounded-md text-[#827a73] transition-colors hover:bg-[rgba(255,60,0,0.12)] hover:text-[#ff8a4a]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      )}

      {confirmDelete && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.06)] px-3 py-2">
          <span className="text-xs text-[#ff8a4a]">
            Delete stage “{stage.title}” and its checkpoints?
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
        </div>
      )}

      {/* Checkpoints */}
      <div className="mt-3 border-t border-[#302923] pt-2">
        <p className="px-3 pb-1 text-[11px] font-semibold tracking-[0.1em] text-[#827a73] uppercase">
          Checkpoints
        </p>
        <ul className="flex flex-col gap-1">
          {stage.checkpoints.length === 0 && (
            <li className="px-3 py-1 text-xs text-[#827a73]">No checkpoints yet.</li>
          )}
          {stage.checkpoints.map((checkpoint) => (
            <CheckpointRow
              key={checkpoint.id}
              roadmapId={roadmapId}
              checkpoint={checkpoint}
              onForbidden={onForbidden}
              onActionError={onActionError}
            />
          ))}
        </ul>
        <form
          className="mt-2 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            if (taskDraft.trim()) addCheckpoint.mutate()
          }}
        >
          <input
            value={taskDraft}
            onChange={(e) => setTaskDraft(e.target.value)}
            maxLength={300}
            placeholder="New checkpoint task"
            className={`${inputClasses} sm:max-w-[320px]`}
          />
          <input
            value={timeDraft}
            onChange={(e) => setTimeDraft(e.target.value)}
            maxLength={50}
            placeholder="2–3 hrs"
            className={`${inputClasses} sm:max-w-[110px]`}
          />
          <button
            type="submit"
            disabled={addCheckpoint.isPending || !taskDraft.trim()}
            className={`${accentButtonClasses} shrink-0 justify-center`}
          >
            {addCheckpoint.isPending ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Add checkpoint
          </button>
        </form>
        {addCheckpoint.isError && (
          <p className="px-3 pt-1 text-xs text-[#ff8a4a]">
            {messageOf(addCheckpoint.error, 'Adding the checkpoint failed.')}
          </p>
        )}
      </div>
    </li>
  )
}

// ── Roadmap ──────────────────────────────────────────────────────────────────

function RoadmapAdminCard({
  roadmap,
  onForbidden,
  onActionError,
}: AdminPageProps & { roadmap: RoadmapSummary }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(roadmap.title)
  const [descDraft, setDescDraft] = useState(roadmap.description ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [topicTitle, setTopicTitle] = useState('')
  const [topicDesc, setTopicDesc] = useState('')
  const [topicStage, setTopicStage] = useState('')
  const [stageTitle, setStageTitle] = useState('')

  const handleError = useAdminErrors(onForbidden, onActionError)

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
      updateRoadmap(roadmap.id, {
        title: titleDraft.trim(),
        description: descDraft.trim() || undefined,
      }),
    onSuccess: () => {
      setEditing(false)
      invalidate()
    },
    onError: (error) => handleError(error, 'The update failed.'),
  })

  const remove = useMutation({
    mutationFn: () => deleteRoadmap(roadmap.id),
    onSuccess: invalidate,
    onError: (error) => handleError(error, 'Deleting the roadmap failed.'),
  })

  const addTopic = useMutation({
    mutationFn: () =>
      createTopic(roadmap.id, {
        title: topicTitle.trim(),
        description: topicDesc.trim() || undefined,
        stage: topicStage === '' ? undefined : Number(topicStage),
      }),
    onSuccess: () => {
      setTopicTitle('')
      setTopicDesc('')
      invalidate()
    },
    onError: (error) => handleError(error, 'Adding the topic failed.'),
  })

  const addStage = useMutation({
    mutationFn: () =>
      createStage(roadmap.id, {
        title: stageTitle.trim(),
        position: (detail.data?.stages.length ?? 0) + 1,
      }),
    onSuccess: () => {
      setStageTitle('')
      invalidate()
    },
    onError: (error) => handleError(error, 'Adding the stage failed.'),
  })

  const stages = detail.data?.stages ?? []

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
              className={accentButtonClasses}
            >
              {update.isPending ? <Spinner className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              Save changes
            </button>
            {update.isError && (
              <span className="text-xs text-[#ff8a1a]">{messageOf(update.error, 'Save failed.')}</span>
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
          Stages, topics and documents
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="space-y-4 px-5 pb-5">
            {detail.isPending ? (
              <div className="flex items-center gap-2 py-2 text-xs text-[#827a73]">
                <Spinner /> Loading roadmap…
              </div>
            ) : detail.isError ? (
              <p className="py-2 text-xs text-[#ff8a4a]">
                {messageOf(detail.error, 'Could not load the roadmap.')}
              </p>
            ) : (
              <>
                {/* Stages */}
                <section>
                  <h3 className="mb-2 text-xs font-semibold tracking-[0.1em] text-[#827a73] uppercase">
                    Stages
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {stages.length === 0 && (
                      <li className="px-3 py-2 text-xs text-[#827a73]">No stages yet.</li>
                    )}
                    {stages.map((stage) => (
                      <StageRow
                        key={stage.id}
                        roadmapId={roadmap.id}
                        stage={stage}
                        onForbidden={onForbidden}
                        onActionError={onActionError}
                      />
                    ))}
                  </ul>
                  <form
                    className="mt-2 flex flex-col gap-2 sm:flex-row"
                    onSubmit={(e: FormEvent) => {
                      e.preventDefault()
                      if (stageTitle.trim()) addStage.mutate()
                    }}
                  >
                    <input
                      value={stageTitle}
                      onChange={(e) => setStageTitle(e.target.value)}
                      maxLength={200}
                      placeholder="New stage title"
                      className={`${inputClasses} sm:max-w-[240px]`}
                    />
                    <button
                      type="submit"
                      disabled={addStage.isPending || !stageTitle.trim()}
                      className={`${accentButtonClasses} shrink-0 justify-center`}
                    >
                      {addStage.isPending ? (
                        <Spinner className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      Add stage
                    </button>
                  </form>
                  {addStage.isError && (
                    <p className="pt-1 text-xs text-[#ff8a4a]">
                      {messageOf(addStage.error, 'Adding the stage failed.')}
                    </p>
                  )}
                </section>

                {/* Topics */}
                <section>
                  <h3 className="mb-2 text-xs font-semibold tracking-[0.1em] text-[#827a73] uppercase">
                    Topics
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {detail.data.topics.length === 0 && (
                      <li className="px-3 py-2 text-xs text-[#827a73]">No topics yet.</li>
                    )}
                    {detail.data.topics.map((topic) => (
                      <TopicRow
                        key={topic.id}
                        topic={topic}
                        roadmapId={roadmap.id}
                        stages={stages}
                        onForbidden={onForbidden}
                        onActionError={onActionError}
                      />
                    ))}
                  </ul>

                  <form
                    className="mt-2 flex flex-col gap-2 sm:flex-row"
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
                      className={`${inputClasses} sm:max-w-[220px]`}
                    />
                    <input
                      value={topicDesc}
                      onChange={(e) => setTopicDesc(e.target.value)}
                      maxLength={500}
                      placeholder="Topic description (optional)"
                      className={`${inputClasses} sm:max-w-[200px]`}
                    />
                    <select
                      value={topicStage}
                      onChange={(e) => setTopicStage(e.target.value)}
                      aria-label="Stage for the new topic"
                      className={`${inputClasses} sm:max-w-[160px]`}
                    >
                      <option value="">No stage</option>
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.position}>
                          Stage {stage.position} — {stage.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={addTopic.isPending || !topicTitle.trim()}
                      className={`${accentButtonClasses} shrink-0 justify-center`}
                    >
                      {addTopic.isPending ? (
                        <Spinner className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      Add topic
                    </button>
                  </form>
                  {addTopic.isError && (
                    <p className="pt-1 text-xs text-[#ff8a4a]">
                      {messageOf(addTopic.error, 'Adding the topic failed.')}
                    </p>
                  )}
                </section>
              </>
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
    mutationFn: () =>
      createRoadmap({ title: title.trim(), description: description.trim() || undefined }),
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
            Create roadmaps, arrange stages, topics and checkpoints, and upload the Markdown
            document behind every topic.
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
                className={accentButtonClasses}
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
