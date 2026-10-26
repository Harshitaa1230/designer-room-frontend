import { useState } from 'react'
import type { TopicQuizQuestion } from '@/lib/endpoints'

interface TopicQuizProps {
  questions: TopicQuizQuestion[]
}

export function TopicQuiz({ questions }: TopicQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})

  if (questions.length === 0) {
    return null
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  return (
    <section className="mt-10 border-t border-[#302923] pt-8 sm:mt-12 sm:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#ff8a4a] sm:text-[11px]">
            Quick quiz
          </p>
          <h2 className="mt-1 text-[22px] font-medium leading-tight text-[#fff8ee] sm:text-[26px]">
            Check your understanding
          </h2>
        </div>
        {answeredCount > 0 ? (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="rounded-full border border-[#302923] px-3 py-1.5 text-[12px] text-[#b6ada4] transition-colors hover:border-[#504740] hover:text-white sm:text-[13px]"
          >
            Try again
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex]
          const answered = selected !== undefined
          const correct = selected === question.answerIndex

          return (
            <div
              key={`${questionIndex}-${question.question}`}
              className="rounded-[16px] border border-[#302923] bg-[#11100f] p-4 sm:p-5"
            >
              <p className="text-[15px] font-medium leading-6 text-[#fff8ee] sm:text-[16px]">
                {questionIndex + 1}. {question.question}
              </p>

              <div className="mt-3 flex flex-col gap-2" role="group" aria-label={question.question}>
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex
                  const isAnswer = optionIndex === question.answerIndex
                  const showCorrect = answered && isAnswer
                  const showWrong = answered && isSelected && !isAnswer

                  return (
                    <button
                      key={`${optionIndex}-${option}`}
                      type="button"
                      disabled={answered}
                      aria-pressed={isSelected}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [questionIndex]: optionIndex,
                        }))
                      }
                      className={[
                        'flex w-full items-start gap-3 rounded-[10px] border px-3 py-2.5 text-left text-[13px] leading-6 transition-colors sm:text-[14px]',
                        showCorrect
                          ? 'border-[#3f6b4a] bg-[#122017] text-[#d8f0dd]'
                          : showWrong
                            ? 'border-[#7a3b2a] bg-[#24120d] text-[#ffd0c2]'
                            : isSelected
                              ? 'border-[#ff8a4a] bg-[#1d1916] text-[#fff8ee]'
                              : 'border-[#302923] bg-[#0d0c0b] text-[#b6ada4] hover:border-[#504740] hover:text-white',
                        answered ? 'cursor-default' : '',
                      ].join(' ')}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showCorrect ? (
                        <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em]">
                          Correct
                        </span>
                      ) : null}
                      {showWrong ? (
                        <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em]">
                          Not quite
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {answered ? (
                <div
                  className={[
                    'mt-3 rounded-[10px] border px-3 py-3 text-[13px] leading-6 sm:text-[14px]',
                    correct
                      ? 'border-[#3f6b4a] bg-[#122017] text-[#d8f0dd]'
                      : 'border-[#7a3b2a] bg-[#24120d] text-[#ffd0c2]',
                  ].join(' ')}
                >
                  <p className="font-medium">{correct ? 'Correct.' : 'Not quite.'}</p>
                  <p className="mt-1 opacity-90">{question.why}</p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {allAnswered ? (
        <p className="mt-4 text-[13px] text-[#827a73] sm:text-[14px]">
          Quiz complete. Read the explanations, then try the practice task above.
        </p>
      ) : null}
    </section>
  )
}
