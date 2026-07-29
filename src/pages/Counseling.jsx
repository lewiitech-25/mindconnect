import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore'

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaUserCheck,
  FaUserMd,
  FaVideo
} from 'react-icons/fa'

import {
  auth,
  db
} from '../firebase/config'

import {
  bookAppointment,
  getAppointments
} from '../firebase/appointmentService'

import {
  getUserProfile
} from '../firebase/userService'

const availableTimeSlots = [
  '9:00 AM',
  '11:00 AM',
  '2:00 PM',
  '4:00 PM'
]

const getUpcomingDays = () => {
  const days = []

  const weekdayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  /*
   * Search the next 14 calendar days and
   * return the first three counselling days.
   */
  for (
    let index = 1;
    index <= 14;
    index += 1
  ) {
    const nextDay = new Date()

    nextDay.setDate(
      nextDay.getDate() + index
    )

    const dayName =
      weekdayNames[nextDay.getDay()]

    if (
      [
        'Monday',
        'Tuesday',
        'Wednesday'
      ].includes(dayName)
    ) {
      days.push({
        dayName,

        dateString:
          nextDay.toLocaleDateString(
            undefined,
            {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }
          ),

        dateValue:
          nextDay
            .toISOString()
            .split('T')[0]
      })
    }

    if (days.length === 3) {
      break
    }
  }

  return days
}

export default function Counseling() {
  const navigate = useNavigate()

  const [user, setUser] =
    useState(null)

  const [
    counselors,
    setCounselors
  ] = useState([])

  const [
    loadingCounselors,
    setLoadingCounselors
  ] = useState(true)

  /*
   * These are the signed-in student's
   * appointments. They are used for the
   * student's personal booking history.
   */
  const [
    existingAppointments,
    setExistingAppointments
  ] = useState([])

  /*
   * These are shared slot reservations from
   * appointmentSlots. They allow every student
   * to see which counselor slots are occupied
   * without reading another student's private
   * appointment information.
   */
  const [
    bookedSlots,
    setBookedSlots
  ] = useState([])

  const [
    loadingSlots,
    setLoadingSlots
  ] = useState(false)

  const [step, setStep] =
    useState(1)

  const [
    selectedCounselor,
    setSelectedCounselor
  ] = useState(null)

  const [
    selectedDay,
    setSelectedDay
  ] = useState(null)

  const [
    selectedTimeSlot,
    setSelectedTimeSlot
  ] = useState('')

  const [
    sessionMode,
    setSessionMode
  ] = useState('Online Video')

  const [notes, setNotes] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [booking, setBooking] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [
    bookingError,
    setBookingError
  ] = useState('')

  const upcomingDays = useMemo(
    () => getUpcomingDays(),
    []
  )

  const loadCounselors = async () => {
    try {
      setLoadingCounselors(true)

      const counselorQuery = query(
        collection(db, 'users'),
        where(
          'role',
          '==',
          'counselor'
        )
      )

      const snapshot =
        await getDocs(counselorQuery)

      const counselorList =
        snapshot.docs
          .map(
            (
              counselorDocument,
              index
            ) => {
              const data =
                counselorDocument.data()

              const accountStatus =
                data.accountStatus ||
                'active'

              const isAvailable =
                typeof data.isAvailable ===
                'boolean'
                  ? data.isAvailable
                  : accountStatus ===
                    'active'

              return {
                id:
                  counselorDocument.id,

                ...data,

                accountStatus,
                isAvailable,

                specialty:
                  data.specialty ||
                  'General Counseling',

                description:
                  data.description ||
                  data.qualification ||
                  'Available to support students with mental health and wellbeing concerns.',

                avatarColor:
                  index % 3 === 0
                    ? 'bg-blue-100 text-blue-700'
                    : index % 3 === 1
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-purple-100 text-purple-700'
              }
            }
          )
          .filter(
            (counselor) =>
              counselor.accountStatus ===
                'active' &&
              counselor.isAvailable
          )
          .sort(
            (first, second) =>
              (
                first.name || ''
              ).localeCompare(
                second.name || ''
              )
          )

      setCounselors(
        counselorList
      )
    } catch (error) {
      console.error(
        'Failed to load counselors:',
        error
      )

      setBookingError(
        'Unable to load available counselors.'
      )
    } finally {
      setLoadingCounselors(false)
    }
  }

  const loadStudentAppointments =
    async (studentUid) => {
      try {
        const appointments =
          await getAppointments(
            studentUid
          )

        setExistingAppointments(
          appointments
        )

        return appointments
      } catch (error) {
        console.error(
          'Failed to load student appointments:',
          error
        )

        setExistingAppointments([])

        return []
      }
    }

  /*
   * Loads shared reservations for one
   * counselor on one calendar date.
   */
  const loadBookedSlots = async (
    counselorId,
    dateValue
  ) => {
    if (
      !counselorId ||
      !dateValue
    ) {
      setBookedSlots([])
      return
    }

    try {
      setLoadingSlots(true)

      const slotsQuery = query(
        collection(
          db,
          'appointmentSlots'
        ),

        where(
          'counselorId',
          '==',
          counselorId
        ),

        where(
          'dateValue',
          '==',
          dateValue
        )
      )

      const snapshot =
        await getDocs(slotsQuery)

      const reservations =
        snapshot.docs.map(
          (slotDocument) => ({
            id: slotDocument.id,
            ...slotDocument.data()
          })
        )

      setBookedSlots(
        reservations
      )
    } catch (error) {
      console.error(
        'Failed to load booked slots:',
        error
      )

      setBookedSlots([])

      setBookingError(
        'Unable to check the latest appointment availability.'
      )
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          if (!currentUser) {
            setLoading(false)
            navigate('/login')
            return
          }

          try {
            setLoading(true)
            setBookingError('')

            const [
              profile,
              appointments
            ] = await Promise.all([
              getUserProfile(
                currentUser.uid
              ),

              getAppointments(
                currentUser.uid
              ),

              loadCounselors()
            ])

            setUser({
              uid: currentUser.uid,
              ...profile
            })

            setExistingAppointments(
              appointments
            )
          } catch (error) {
            console.error(
              'Failed to load counselling page:',
              error
            )

            setBookingError(
              'Unable to load your account information.'
            )
          } finally {
            setLoading(false)
          }
        }
      )

    return () => unsubscribe()
  }, [navigate])

  /*
   * Refresh the visible reservations whenever
   * the selected counselor or day changes.
   */
  useEffect(() => {
    if (
      selectedCounselor?.id &&
      selectedDay?.dateValue
    ) {
      loadBookedSlots(
        selectedCounselor.id,
        selectedDay.dateValue
      )
    } else {
      setBookedSlots([])
    }
  }, [
    selectedCounselor,
    selectedDay
  ])

  const isTimeSlotAlreadyBooked = (
    counselorId,
    day,
    time
  ) => {
    if (
      !counselorId ||
      !day ||
      !time
    ) {
      return false
    }

    /*
     * Primary shared check.
     */
    const reservedByAnyStudent =
      bookedSlots.some(
        (slot) =>
          slot.counselorId ===
            counselorId &&
          slot.dateValue ===
            day.dateValue &&
          slot.timeSlot === time &&
          slot.status !==
            'Cancelled'
      )

    /*
     * Fallback check against the signed-in
     * student's appointments. This helps with
     * older appointments created before the
     * appointmentSlots collection was added.
     */
    const bookedByCurrentStudent =
      existingAppointments.some(
        (appointment) =>
          appointment.counselorId ===
            counselorId &&
          (
            appointment.dateValue ===
              day.dateValue ||
            appointment.date ===
              day.dateString
          ) &&
          appointment.timeSlot ===
            time &&
          appointment.status !==
            'Cancelled'
      )

    return (
      reservedByAnyStudent ||
      bookedByCurrentStudent
    )
  }

  const handleSelectCounselor = (
    counselor
  ) => {
    setSelectedCounselor(
      counselor
    )

    setSelectedDay(null)
    setSelectedTimeSlot('')
    setBookedSlots([])
    setBookingError('')
    setSuccess(false)
  }

  const handleSelectDay = (
    day
  ) => {
    setSelectedDay(day)
    setSelectedTimeSlot('')
    setBookingError('')
    setSuccess(false)
  }

  const resetBookingForm = () => {
    setStep(1)
    setSelectedCounselor(null)
    setSelectedDay(null)
    setSelectedTimeSlot('')
    setSessionMode('Online Video')
    setNotes('')
    setBookedSlots([])
    setSuccess(false)
    setBookingError('')
  }

  const handleBooking = async () => {
    if (
      !selectedCounselor ||
      !selectedDay ||
      !selectedTimeSlot
    ) {
      setBookingError(
        'Please select a counsellor, date, and time.'
      )

      return
    }

    const currentUser =
      auth.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    /*
     * Recheck the current local availability
     * before sending the booking request.
     */
    const slotAlreadyBooked =
      isTimeSlotAlreadyBooked(
        selectedCounselor.id,
        selectedDay,
        selectedTimeSlot
      )

    if (slotAlreadyBooked) {
      setBookingError(
        'This time slot is no longer available. Please choose another time.'
      )

      setSelectedTimeSlot('')

      await loadBookedSlots(
        selectedCounselor.id,
        selectedDay.dateValue
      )

      return
    }

    const newAppointment = {
      counselorId:
        selectedCounselor.id,

      counselorName:
        selectedCounselor.name ||
        '',

      counselorSpecialty:
        selectedCounselor.specialty ||
        'General Counseling',

      studentUid:
        currentUser.uid,

      studentId:
        user?.studentId || '',

      studentName:
        user?.name ||
        currentUser.displayName ||
        '',

      studentEmail:
        user?.email ||
        currentUser.email ||
        '',

      date:
        selectedDay.dateString,

      dateValue:
        selectedDay.dateValue,

      dayName:
        selectedDay.dayName,

      timeSlot:
        selectedTimeSlot,

      mode:
        sessionMode,

      notes:
        notes.trim(),

      status:
        'Confirmed'
    }

    try {
      setBooking(true)
      setBookingError('')

      /*
       * bookAppointment should use a Firestore
       * transaction and appointmentSlots so two
       * students cannot reserve the same slot.
       */
      await bookAppointment(
        currentUser.uid,
        newAppointment
      )

      await Promise.all([
        loadStudentAppointments(
          currentUser.uid
        ),

        loadBookedSlots(
          selectedCounselor.id,
          selectedDay.dateValue
        )
      ])

      setSuccess(true)
    } catch (error) {
      console.error(
        'Booking failed:',
        error
      )

      if (
        error.code ===
        'slot-already-booked'
      ) {
        setBookingError(
          'Sorry, another student booked this time just before you. Please choose another time.'
        )

        setSelectedTimeSlot('')

        await Promise.all([
          loadStudentAppointments(
            currentUser.uid
          ),

          loadBookedSlots(
            selectedCounselor.id,
            selectedDay.dateValue
          )
        ])

        /*
         * Return to the time-selection step so
         * the student can choose another slot.
         */
        setStep(2)

        return
      }

      if (
        error.code ===
        'permission-denied'
      ) {
        setBookingError(
          'The appointment could not be saved because Firestore denied access. Check the appointment and slot security rules.'
        )

        return
      }

      setBookingError(
        error.message ||
        'Unable to book the appointment. Please try again.'
      )
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 pl-0 md:pl-64">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />

          <p className="text-xs font-semibold text-slate-500">
            Loading counsellors...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern transition-all duration-300 page-transition-enter">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-6">
        <div>
          <h2 className="font-poppins text-lg font-bold text-text-custom">
            Book Counsellor Consultation
          </h2>

          <p className="text-[10px] text-slate-400">
            Booking for{' '}
            {user.name ||
              user.email}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>
            Step {step} of 3
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">
            Schedule a Counselling Session
          </h1>

          <p className="max-w-xl text-xs text-slate-500">
            Book a confidential consultation
            with a clinical psychologist or
            academic wellness adviser. Sessions
            are free for registered students.
          </p>
        </div>

        {bookingError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">
            {bookingError}
          </div>
        )}

        {success && (
          <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg animate-in zoom-in-95 duration-200">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-500">
              <FaCheckCircle className="animate-bounce text-4xl" />
            </div>

            <h3 className="font-poppins text-xl font-bold text-text-custom">
              Session Booked
            </h3>

            <p className="text-xs leading-normal text-slate-500">
              Your appointment with{' '}
              <strong>
                {selectedCounselor?.name}
              </strong>{' '}
              on{' '}
              {selectedDay?.dateString}{' '}
              at {selectedTimeSlot} has
              been confirmed.
            </p>

            <button
              type="button"
              onClick={resetBookingForm}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-primary/95"
            >
              Book Another Session
            </button>
          </div>
        )}

        {!success && (
          <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-50 pb-4">
              <button
                type="button"
                onClick={() =>
                  setStep(1)
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  step === 1
                    ? 'bg-primary text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                1. Select Counsellor
              </button>

              <span className="text-slate-300">
                /
              </span>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedCounselor
                  ) {
                    setStep(2)
                  }
                }}
                disabled={
                  !selectedCounselor
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  step === 2
                    ? 'bg-primary text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50'
                }`}
              >
                2. Choose Date and Time
              </button>

              <span className="text-slate-300">
                /
              </span>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedCounselor &&
                    selectedDay &&
                    selectedTimeSlot
                  ) {
                    setStep(3)
                  }
                }}
                disabled={
                  !selectedCounselor ||
                  !selectedDay ||
                  !selectedTimeSlot
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  step === 3
                    ? 'bg-primary text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50'
                }`}
              >
                3. Session Details
              </button>
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-poppins text-sm font-bold text-text-custom">
                  Available Clinical Advisers
                </h3>

                <div className="space-y-4">
                  {loadingCounselors && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                      <p className="text-xs font-semibold text-slate-500">
                        Loading available
                        counselors...
                      </p>
                    </div>
                  )}

                  {!loadingCounselors &&
                    counselors.length ===
                      0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          No counselors
                          available
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Please check again
                          later.
                        </p>
                      </div>
                    )}

                  {!loadingCounselors &&
                    counselors.map(
                      (counselor) => {
                        const active =
                          selectedCounselor?.id ===
                          counselor.id

                        return (
                          <button
                            key={
                              counselor.id
                            }
                            type="button"
                            onClick={() =>
                              handleSelectCounselor(
                                counselor
                              )
                            }
                            className={`flex w-full cursor-pointer items-start space-x-4 rounded-xl border p-4 text-left transition-all hover:shadow-sm ${
                              active
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-lg font-bold ${counselor.avatarColor}`}
                            >
                              <FaUserMd />
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-3">
                                <h4 className="font-poppins text-sm font-bold text-text-custom">
                                  {counselor.name ||
                                    'Unnamed Counselor'}
                                </h4>

                                {active && (
                                  <span className="inline-flex items-center space-x-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                    <FaUserCheck />

                                    <span>
                                      Selected
                                    </span>
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] font-semibold text-primary">
                                {counselor.specialty}
                              </p>

                              <p className="pt-1 text-xs leading-normal text-slate-500">
                                {counselor.description}
                              </p>
                            </div>
                          </button>
                        )
                      }
                    )}
                </div>

                <div className="flex justify-end border-t border-slate-50 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setStep(2)
                    }
                    disabled={
                      !selectedCounselor
                    }
                    className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                      selectedCounselor
                        ? 'cursor-pointer bg-primary shadow-primary/10 hover:bg-primary/95'
                        : 'cursor-not-allowed bg-slate-300 shadow-none'
                    }`}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <h3 className="font-poppins text-sm font-bold text-text-custom">
                    Select Appointment Day
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {upcomingDays.map(
                      (day) => {
                        const active =
                          selectedDay?.dateValue ===
                          day.dateValue

                        return (
                          <button
                            key={
                              day.dateValue
                            }
                            type="button"
                            onClick={() =>
                              handleSelectDay(
                                day
                              )
                            }
                            className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                              active
                                ? 'scale-[1.02] border-primary bg-primary/5 text-primary shadow-sm'
                                : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <FaCalendarAlt
                              size={16}
                              className="mb-2 text-slate-400"
                            />

                            <span className="text-xs font-bold uppercase">
                              {day.dayName}
                            </span>

                            <span className="mt-1 text-[10px] text-slate-500">
                              {day.dateString}
                            </span>
                          </button>
                        )
                      }
                    )}
                  </div>
                </div>

                {selectedDay && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-poppins text-sm font-bold text-text-custom">
                        Select Available Time
                        Slot
                      </h3>

                      {loadingSlots && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Checking
                          availability...
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {availableTimeSlots.map(
                        (time) => {
                          const active =
                            selectedTimeSlot ===
                            time

                          const unavailable =
                            isTimeSlotAlreadyBooked(
                              selectedCounselor.id,
                              selectedDay,
                              time
                            )

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={
                                unavailable ||
                                loadingSlots
                              }
                              onClick={() => {
                                setSelectedTimeSlot(
                                  time
                                )

                                setBookingError(
                                  ''
                                )
                              }}
                              className={`rounded-xl border p-3 text-center transition-all ${
                                unavailable
                                  ? 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400'
                                  : active
                                    ? 'border-primary bg-primary/5 font-bold text-primary shadow-sm'
                                    : 'border-slate-100 bg-slate-50/20 text-xs font-medium text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                              } ${
                                loadingSlots
                                  ? 'cursor-wait opacity-60'
                                  : ''
                              }`}
                            >
                              <FaClock
                                className="mr-1 inline text-slate-400"
                                size={10}
                              />

                              <span>
                                {unavailable
                                  ? `${time} — Booked`
                                  : time}
                              </span>
                            </button>
                          )
                        }
                      )}
                    </div>

                    {!loadingSlots &&
                      availableTimeSlots.every(
                        (time) =>
                          isTimeSlotAlreadyBooked(
                            selectedCounselor.id,
                            selectedDay,
                            time
                          )
                      ) && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700">
                          All appointments for
                          this date are already
                          booked. Please select
                          another day.
                        </div>
                      )}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setStep(1)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStep(3)
                    }
                    disabled={
                      !selectedDay ||
                      !selectedTimeSlot ||
                      loadingSlots
                    }
                    className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                      selectedDay &&
                      selectedTimeSlot &&
                      !loadingSlots
                        ? 'cursor-pointer bg-primary shadow-primary/10 hover:bg-primary/95'
                        : 'cursor-not-allowed bg-slate-300 shadow-none'
                    }`}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <h3 className="font-poppins text-sm font-bold text-text-custom">
                    Select Session Mode
                  </h3>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSessionMode(
                          'Online Video'
                        )
                      }
                      className={`flex items-center space-x-3 rounded-xl border p-4 text-left transition-all ${
                        sessionMode ===
                        'Online Video'
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FaVideo />
                      </div>

                      <div>
                        <span className="block text-xs font-bold">
                          Online Video
                        </span>

                        <span className="text-[10px] text-slate-500">
                          A secure link will be
                          sent before the session
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSessionMode(
                          'In Person'
                        )
                      }
                      className={`flex items-center space-x-3 rounded-xl border p-4 text-left transition-all ${
                        sessionMode ===
                        'In Person'
                          ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                          : 'border-slate-100 bg-slate-50/20 text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                        <FaMapMarkerAlt />
                      </div>

                      <div>
                        <span className="block text-xs font-bold">
                          In Person
                        </span>

                        <span className="text-[10px] text-slate-500">
                          Student Clinic,
                          Block C
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
                    Reason for Visit
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                    maxLength={500}
                    placeholder="Briefly describe what you would like to discuss. This field is optional and confidential."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-text-custom outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />

                  <p className="text-right text-[10px] text-slate-400">
                    {notes.length}/500
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h4 className="border-b border-slate-200/50 pb-1.5 font-poppins text-xs font-bold uppercase tracking-wide text-text-custom">
                    Booking Summary
                  </h4>

                  <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <div>
                      Counsellor:{' '}
                      <strong className="text-text-custom">
                        {selectedCounselor?.name}
                      </strong>
                    </div>

                    <div>
                      Mode:{' '}
                      <strong className="text-text-custom">
                        {sessionMode}
                      </strong>
                    </div>

                    <div>
                      Date:{' '}
                      <strong className="text-text-custom">
                        {selectedDay?.dateString}
                      </strong>
                    </div>

                    <div>
                      Time:{' '}
                      <strong className="text-text-custom">
                        {selectedTimeSlot}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setStep(2)
                    }
                    disabled={booking}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleBooking}
                    disabled={booking}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all duration-200 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {booking
                      ? 'Booking Session...'
                      : 'Confirm and Book Session'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}