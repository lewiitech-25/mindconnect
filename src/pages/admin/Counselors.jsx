import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  deleteApp,
  initializeApp
} from 'firebase/app'

import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signOut,
  updateProfile
} from 'firebase/auth'

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'

import {
  FaBan,
  FaBriefcaseMedical,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaTrash,
  FaTimes,
  FaTimesCircle,
  FaUserMd,
  FaUsers
} from 'react-icons/fa'

import {
  db,
  firebaseConfig
} from '../../firebase/config'

const INITIAL_ADD_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  specialty: '',
  qualification: '',
  description: '',
  office: '',
  capacity: 15
}

const INITIAL_EDIT_FORM = {
  name: '',
  email: '',
  phone: '',
  specialty: '',
  qualification: '',
  description: '',
  office: '',
  capacity: 15,
  accountStatus: 'active',
  isAvailable: true
}

const INITIAL_CONFIRMATION = {
  open: false,
  type: '',
  counselor: null
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  min,
  max,
  minLength,
  helperText,
  className = ''
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-extrabold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        minLength={minLength}
        autoComplete={
          type === 'password'
            ? 'new-password'
            : undefined
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xs outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />

      {helperText && (
        <p className="mt-1 text-[10px] font-medium text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const currentStatus =
    status || 'active'

  if (currentStatus === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
        <FaClock size={10} />
        Pending
      </span>
    )
  }

  if (currentStatus === 'disabled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-700">
        <FaTimesCircle size={10} />
        Disabled
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
      <FaCheckCircle size={10} />
      Active
    </span>
  )
}

function StatCard({
  label,
  value,
  description,
  icon,
  accentClass = ''
}) {
  return (
    <div
      className={`rounded-3xl border bg-white p-5 shadow-md ${accentClass}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          {label}
        </span>

        {icon}
      </div>

      <div className="mt-2 text-3xl font-extrabold text-slate-900">
        {value}
      </div>

      <p className="mt-1 text-[11px] font-bold text-slate-600">
        {description}
      </p>
    </div>
  )
}

function ConfirmationModal({
  confirmation,
  confirmationText,
  setConfirmationText,
  processing,
  onCancel,
  onConfirm
}) {
  if (
    !confirmation.open ||
    !confirmation.counselor
  ) {
    return null
  }

  const counselor =
    confirmation.counselor

  const counselorName =
    counselor.name || 'this counselor'

  const isDelete =
    confirmation.type === 'delete'

  const isDisable =
    confirmation.type === 'disable'

  const isRestore =
    confirmation.type === 'restore'

  const deleteConfirmed =
    confirmationText.trim() === 'DELETE'

  let title = ''
  let description = ''
  let confirmLabel = ''
  let confirmClass = ''

  if (isDelete) {
    title = 'Delete Counselor Profile'

    description =
      'This permanently removes the counselor profile from Firestore. Counselors with appointment records cannot be deleted.'

    confirmLabel = 'Delete Profile'

    confirmClass =
      'bg-red-600 text-white hover:bg-red-700'
  }

  if (isDisable) {
    title = 'Disable Counselor'

    description =
      'The counselor will be unavailable to students and will no longer appear as an available booking option.'

    confirmLabel = 'Disable Counselor'

    confirmClass =
      'bg-amber-600 text-white hover:bg-amber-700'
  }

  if (isRestore) {
    title = 'Restore Counselor'

    description =
      'The counselor account will become active and available for student appointments again.'

    confirmLabel = 'Restore Counselor'

    confirmClass =
      'bg-emerald-600 text-white hover:bg-emerald-700'
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !processing
        ) {
          onCancel()
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                isDelete
                  ? 'bg-red-100 text-red-600'
                  : isDisable
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isDelete ? (
                <FaTrash />
              ) : isDisable ? (
                <FaBan />
              ) : (
                <FaCheckCircle />
              )}
            </div>

            <div>
              <h3 className="font-poppins text-base font-extrabold text-slate-900">
                {title}
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {counselorName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            {description}
          </p>

          {isDelete && (
            <>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-2.5">
                  <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-xs font-extrabold text-red-800">
                      This action cannot be undone
                    </p>

                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-red-700">
                      This removes the Firestore
                      profile only. The Authentication
                      account must still be removed
                      separately from Firebase
                      Authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                  Type DELETE to confirm
                </label>

                <input
                  type="text"
                  value={confirmationText}
                  onChange={(event) =>
                    setConfirmationText(
                      event.target.value
                    )
                  }
                  disabled={processing}
                  placeholder="DELETE"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xs font-bold uppercase outline-none transition-colors focus:border-red-500 disabled:bg-slate-100"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={
              processing ||
              (isDelete && !deleteConfirmed)
            }
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}
          >
            {processing && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}

            {processing
              ? 'Processing...'
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Counselors() {
  const [counselors, setCounselors] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [pageMessage, setPageMessage] =
    useState('')

  const [searchTerm, setSearchTerm] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('all')

  const [addModalOpen, setAddModalOpen] =
    useState(false)

  const [addForm, setAddForm] =
    useState(INITIAL_ADD_FORM)

  const [creating, setCreating] =
    useState(false)

  const [addError, setAddError] =
    useState('')

  const [addSuccess, setAddSuccess] =
    useState('')

  const [editModalOpen, setEditModalOpen] =
    useState(false)

  const [
    selectedCounselor,
    setSelectedCounselor
  ] = useState(null)

  const [editForm, setEditForm] =
    useState(INITIAL_EDIT_FORM)

  const [updating, setUpdating] =
    useState(false)

  const [editError, setEditError] =
    useState('')

  const [editSuccess, setEditSuccess] =
    useState('')

  const [processingId, setProcessingId] =
    useState('')

  const [
    confirmation,
    setConfirmation
  ] = useState(INITIAL_CONFIRMATION)

  const [
    confirmationText,
    setConfirmationText
  ] = useState('')

  const loadCounselors = async () => {
    try {
      setLoading(true)
      setError('')

      const counselorQuery = query(
        collection(db, 'users'),
        where('role', '==', 'counselor')
      )

      const snapshot =
        await getDocs(counselorQuery)

      const counselorList =
        snapshot.docs.map(
          (counselorDocument) => {
            const data =
              counselorDocument.data()

            const accountStatus =
              data.accountStatus || 'active'

            /*
             * Older counselor records may not have
             * isAvailable. Active records are treated
             * as available by default.
             */
            const isAvailable =
              typeof data.isAvailable ===
              'boolean'
                ? data.isAvailable
                : accountStatus === 'active'

            return {
              id: counselorDocument.id,
              ...data,
              accountStatus,
              isAvailable
            }
          }
        )

      counselorList.sort(
        (first, second) =>
          (first.name || '').localeCompare(
            second.name || ''
          )
      )

      setCounselors(counselorList)
    } catch (loadError) {
      console.error(
        'Failed to load counselors:',
        loadError
      )

      setError(
        'Unable to load counselor accounts.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCounselors()
  }, [])

  const clearPageMessages = () => {
    setError('')
    setPageMessage('')
  }

  const resetAddModal = () => {
    if (creating) {
      return
    }

    setAddModalOpen(false)
    setAddForm(INITIAL_ADD_FORM)
    setAddError('')
    setAddSuccess('')
  }

  const handleAddInputChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target

    setAddForm((currentForm) => ({
      ...currentForm,
      [name]:
        name === 'capacity'
          ? Number(value)
          : value
    }))
  }

  const handleAddCounselor = async (
    event
  ) => {
    event.preventDefault()

    let secondaryApp = null
    let secondaryAuth = null
    let createdUser = null

    try {
      setCreating(true)
      setAddError('')
      setAddSuccess('')

      const name =
        addForm.name.trim()

      const email =
        addForm.email
          .trim()
          .toLowerCase()

      const password =
        addForm.password

      const phone =
        addForm.phone.trim()

      const specialty =
        addForm.specialty.trim()

      const qualification =
        addForm.qualification.trim()

      const description =
        addForm.description.trim()

      const office =
        addForm.office.trim()

      const capacity =
        Number(addForm.capacity)

      if (
        !name ||
        !email ||
        !password ||
        !specialty
      ) {
        setAddError(
          'Name, email, temporary password and specialty are required.'
        )

        return
      }

      if (!email.includes('@')) {
        setAddError(
          'Enter a valid email address.'
        )

        return
      }

      if (password.length < 6) {
        setAddError(
          'The temporary password must contain at least 6 characters.'
        )

        return
      }

      if (
        !Number.isInteger(capacity) ||
        capacity < 1
      ) {
        setAddError(
          'Capacity must be at least 1.'
        )

        return
      }

      const duplicateQuery = query(
        collection(db, 'users'),
        where('email', '==', email)
      )

      const duplicateSnapshot =
        await getDocs(duplicateQuery)

      if (!duplicateSnapshot.empty) {
        setAddError(
          'A user with this email address already exists.'
        )

        return
      }

      secondaryApp = initializeApp(
        firebaseConfig,
        `counselor-creator-${Date.now()}`
      )

      secondaryAuth =
        getAuth(secondaryApp)

      const credential =
        await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          password
        )

      createdUser =
        credential.user

      await updateProfile(
        createdUser,
        {
          displayName: name
        }
      )

      const counselorProfile = {
        uid: createdUser.uid,
        authUid: createdUser.uid,
        name,
        email,
        phone,
        specialty,
        qualification,
        description,
        office,
        capacity,
        activeSlots: 0,
        role: 'counselor',

        /*
         * These are explicitly stored together.
         * A newly-created active counselor is
         * immediately visible for bookings.
         */
        accountStatus: 'active',
        isAvailable: true,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(
        doc(
          db,
          'users',
          createdUser.uid
        ),
        counselorProfile
      )

      /*
       * Explicit follow-up ensures availability
       * remains true even if an older converter
       * or default-value handler interferes.
       */
      await updateDoc(
        doc(
          db,
          'users',
          createdUser.uid
        ),
        {
          accountStatus: 'active',
          isAvailable: true,
          updatedAt: serverTimestamp()
        }
      )

      await signOut(secondaryAuth)

      setAddForm(INITIAL_ADD_FORM)

      setAddSuccess(
        `Counselor account created. ${email} is active and available for bookings.`
      )

      await loadCounselors()

      setTimeout(() => {
        setAddModalOpen(false)
        setAddSuccess('')
      }, 1500)
    } catch (createError) {
      console.error(
        'Failed to create counselor:',
        createError
      )

      if (createdUser) {
        try {
          await deleteUser(createdUser)
        } catch (cleanupError) {
          console.error(
            'Failed to clean up incomplete account:',
            cleanupError
          )
        }
      }

      switch (createError.code) {
        case 'auth/email-already-in-use':
          setAddError(
            'A Firebase Authentication account already uses this email.'
          )
          break

        case 'auth/invalid-email':
          setAddError(
            'Enter a valid email address.'
          )
          break

        case 'auth/weak-password':
          setAddError(
            'Use a stronger temporary password.'
          )
          break

        case 'permission-denied':
          setAddError(
            'Firestore blocked the counselor profile. Check your security rules.'
          )
          break

        default:
          setAddError(
            createError.message ||
              'Unable to create the counselor account.'
          )
      }
    } finally {
      if (
        secondaryAuth?.currentUser
      ) {
        try {
          await signOut(
            secondaryAuth
          )
        } catch (signOutError) {
          console.error(
            'Secondary sign-out failed:',
            signOutError
          )
        }
      }

      if (secondaryApp) {
        try {
          await deleteApp(
            secondaryApp
          )
        } catch (deleteAppError) {
          console.error(
            'Secondary app cleanup failed:',
            deleteAppError
          )
        }
      }

      setCreating(false)
    }
  }

  const openEditModal = (
    counselor
  ) => {
    clearPageMessages()

    const accountStatus =
      counselor.accountStatus ||
      'active'

    const isAvailable =
      typeof counselor.isAvailable ===
      'boolean'
        ? counselor.isAvailable
        : accountStatus === 'active'

    setSelectedCounselor(
      counselor
    )

    setEditForm({
      name: counselor.name || '',
      email: counselor.email || '',
      phone: counselor.phone || '',
      specialty:
        counselor.specialty || '',
      qualification:
        counselor.qualification || '',
      description:
        counselor.description || '',
      office: counselor.office || '',
      capacity:
        Number(counselor.capacity) ||
        15,
      accountStatus,
      isAvailable
    })

    setEditError('')
    setEditSuccess('')
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    if (updating) {
      return
    }

    setEditModalOpen(false)
    setSelectedCounselor(null)
    setEditForm(
      INITIAL_EDIT_FORM
    )
    setEditError('')
    setEditSuccess('')
  }

  const handleEditInputChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target

    setEditForm(
      (currentForm) => {
        const updatedForm = {
          ...currentForm,
          [name]:
            type === 'checkbox'
              ? checked
              : name === 'capacity'
                ? Number(value)
                : value
        }

        /*
         * Active accounts default to available
         * when changed from pending or disabled.
         */
        if (
          name ===
            'accountStatus' &&
          value === 'active' &&
          currentForm.accountStatus !==
            'active'
        ) {
          updatedForm.isAvailable =
            true
        }

        if (
          name ===
            'accountStatus' &&
          value !== 'active'
        ) {
          updatedForm.isAvailable =
            false
        }

        return updatedForm
      }
    )
  }

  const handleUpdateCounselor =
    async (event) => {
      event.preventDefault()

      if (
        !selectedCounselor?.id
      ) {
        return
      }

      try {
        setUpdating(true)
        setEditError('')
        setEditSuccess('')

        const name =
          editForm.name.trim()

        const phone =
          editForm.phone.trim()

        const specialty =
          editForm.specialty.trim()

        const qualification =
          editForm.qualification.trim()

        const description =
          editForm.description.trim()

        const office =
          editForm.office.trim()

        const capacity =
          Number(editForm.capacity)

        if (
          !name ||
          !specialty
        ) {
          setEditError(
            'Name and specialty are required.'
          )

          return
        }

        if (
          !Number.isInteger(
            capacity
          ) ||
          capacity < 1
        ) {
          setEditError(
            'Capacity must be at least 1.'
          )

          return
        }

        const accountStatus =
          editForm.accountStatus

        const isAvailable =
          accountStatus === 'active'
            ? Boolean(
                editForm.isAvailable
              )
            : false

        const updates = {
          name,
          phone,
          specialty,
          qualification,
          description,
          office,
          capacity,
          accountStatus,
          isAvailable,
          updatedAt:
            serverTimestamp()
        }

        await updateDoc(
          doc(
            db,
            'users',
            selectedCounselor.id
          ),
          updates
        )

        setCounselors(
          (currentCounselors) =>
            currentCounselors.map(
              (counselor) =>
                counselor.id ===
                selectedCounselor.id
                  ? {
                      ...counselor,
                      ...updates
                    }
                  : counselor
            )
        )

        setEditSuccess(
          'Counselor updated successfully.'
        )

        setTimeout(() => {
          setEditModalOpen(false)
          setSelectedCounselor(
            null
          )
          setEditForm(
            INITIAL_EDIT_FORM
          )
          setEditSuccess('')
        }, 900)
      } catch (updateError) {
        console.error(
          'Failed to update counselor:',
          updateError
        )

        setEditError(
          'Unable to update the counselor. Check your Firestore permissions.'
        )
      } finally {
        setUpdating(false)
      }
    }

  const openStatusConfirmation = (
    counselor
  ) => {
    clearPageMessages()
    setConfirmationText('')

    const isDisabled =
      counselor.accountStatus ===
      'disabled'

    setConfirmation({
      open: true,
      type: isDisabled
        ? 'restore'
        : 'disable',
      counselor
    })
  }

  const openDeleteConfirmation = (
    counselor
  ) => {
    clearPageMessages()
    setConfirmationText('')

    setConfirmation({
      open: true,
      type: 'delete',
      counselor
    })
  }

  const closeConfirmation = () => {
    if (processingId) {
      return
    }

    setConfirmation(
      INITIAL_CONFIRMATION
    )

    setConfirmationText('')
  }

  const executeStatusChange =
    async (
      counselor,
      restoring
    ) => {
      const updates = {
        accountStatus: restoring
          ? 'active'
          : 'disabled',

        /*
         * Restored counselors are immediately
         * made available again.
         */
        isAvailable: restoring,

        updatedAt:
          serverTimestamp()
      }

      await updateDoc(
        doc(
          db,
          'users',
          counselor.id
        ),
        updates
      )

      setCounselors(
        (currentCounselors) =>
          currentCounselors.map(
            (item) =>
              item.id ===
              counselor.id
                ? {
                    ...item,
                    ...updates
                  }
                : item
          )
      )

      setPageMessage(
        restoring
          ? 'Counselor restored and made available for bookings.'
          : 'Counselor disabled successfully.'
      )
    }

  const executeDeleteCounselor =
    async (counselor) => {
      const appointmentQuery =
        query(
          collection(
            db,
            'appointments'
          ),
          where(
            'counselorId',
            '==',
            counselor.id
          )
        )

      const appointmentSnapshot =
        await getDocs(
          appointmentQuery
        )

      if (
        !appointmentSnapshot.empty
      ) {
        throw new Error(
          `APPOINTMENTS_EXIST:${appointmentSnapshot.size}`
        )
      }

      await deleteDoc(
        doc(
          db,
          'users',
          counselor.id
        )
      )

      setCounselors(
        (currentCounselors) =>
          currentCounselors.filter(
            (item) =>
              item.id !==
              counselor.id
          )
      )

      setPageMessage(
        `${counselor.name || 'Counselor'}'s profile was deleted.`
      )
    }

  const handleConfirmedAction =
    async () => {
      const counselor =
        confirmation.counselor

      if (!counselor?.id) {
        return
      }

      try {
        setProcessingId(
          counselor.id
        )

        setError('')
        setPageMessage('')

        if (
          confirmation.type ===
          'disable'
        ) {
          await executeStatusChange(
            counselor,
            false
          )
        }

        if (
          confirmation.type ===
          'restore'
        ) {
          await executeStatusChange(
            counselor,
            true
          )
        }

        if (
          confirmation.type ===
          'delete'
        ) {
          await executeDeleteCounselor(
            counselor
          )
        }

        setConfirmation(
          INITIAL_CONFIRMATION
        )

        setConfirmationText('')
      } catch (actionError) {
        console.error(
          'Counselor action failed:',
          actionError
        )

        if (
          actionError.message?.startsWith(
            'APPOINTMENTS_EXIST:'
          )
        ) {
          const appointmentCount =
            Number(
              actionError.message.split(
                ':'
              )[1]
            ) || 0

          setError(
            `This counselor has ${appointmentCount} appointment record${appointmentCount === 1 ? '' : 's'}. Disable the account instead of deleting it.`
          )
        } else {
          setError(
            'Unable to complete the counselor action.'
          )
        }

        setConfirmation(
          INITIAL_CONFIRMATION
        )

        setConfirmationText('')
      } finally {
        setProcessingId('')
      }
    }

  const filteredCounselors =
    useMemo(() => {
      const searchValue =
        searchTerm
          .toLowerCase()
          .trim()

      return counselors.filter(
        (counselor) => {
          const matchesSearch =
            !searchValue ||
            counselor.name
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            counselor.email
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            counselor.specialty
              ?.toLowerCase()
              .includes(
                searchValue
              )

          const status =
            counselor.accountStatus ||
            'active'

          const matchesStatus =
            statusFilter ===
              'all' ||
            status ===
              statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      counselors,
      searchTerm,
      statusFilter
    ])

  const stats = useMemo(
    () => ({
      total:
        counselors.length,

      active:
        counselors.filter(
          (counselor) =>
            (
              counselor.accountStatus ||
              'active'
            ) === 'active'
        ).length,

      pending:
        counselors.filter(
          (counselor) =>
            counselor.accountStatus ===
            'pending'
        ).length,

      disabled:
        counselors.filter(
          (counselor) =>
            counselor.accountStatus ===
            'disabled'
        ).length
    }),
    [counselors]
  )

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern text-slate-900 page-transition-enter">
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white px-6 shadow-2xs">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-blue-700">
              <FaUserMd />
            </div>

            <div>
              <h1 className="font-poppins text-sm font-extrabold text-slate-900">
                Counselor Management
              </h1>

              <p className="text-[11px] font-bold text-slate-600">
                Manage counselor accounts,
                availability and workload
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              clearPageMessages()
              setAddError('')
              setAddSuccess('')
              setAddModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-primary/95"
          >
            <FaPlus size={11} />
            Add Counselor
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7 text-white shadow-xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">
            Staff Administration
          </span>

          <h2 className="mt-2 font-poppins text-2xl font-extrabold sm:text-3xl">
            Campus Counselor Directory
          </h2>

          <p className="mt-2 max-w-2xl text-xs font-medium leading-relaxed text-slate-300 sm:text-sm">
            Create login-ready counselor
            accounts, edit profiles, manage
            booking availability and restrict
            inactive accounts.
          </p>
        </section>

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError('')
              }
              className="shrink-0 text-red-500 hover:text-red-800"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {pageMessage && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
            <span>
              {pageMessage}
            </span>

            <button
              type="button"
              onClick={() =>
                setPageMessage('')
              }
              className="shrink-0 text-emerald-500 hover:text-emerald-800"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Counselors"
            value={stats.total}
            description="Registered support staff"
            icon={
              <FaUsers className="text-primary" />
            }
            accentClass="border-slate-200"
          />

          <StatCard
            label="Active"
            value={stats.active}
            description="Enabled accounts"
            icon={
              <FaCheckCircle className="text-emerald-600" />
            }
            accentClass="border-emerald-200"
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            description="Awaiting activation"
            icon={
              <FaClock className="text-amber-600" />
            }
            accentClass="border-amber-200"
          />

          <StatCard
            label="Disabled"
            value={stats.disabled}
            description="Restricted accounts"
            icon={
              <FaTimesCircle className="text-red-600" />
            }
            accentClass="border-red-200"
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-poppins text-sm font-extrabold text-slate-900">
                Counselor Accounts
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Search, edit, disable or delete
                registered counselors.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <FaSearch
                  size={12}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search counselors..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all focus:border-primary sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-primary"
              >
                <option value="all">
                  All statuses
                </option>

                <option value="active">
                  Active
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="disabled">
                  Disabled
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />

                <p className="mt-3 text-xs font-bold text-slate-500">
                  Loading counselors...
                </p>
              </div>
            </div>
          ) : filteredCounselors.length ===
            0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FaUserMd size={22} />
              </div>

              <h4 className="mt-4 font-poppins text-sm font-extrabold text-slate-900">
                No counselors found
              </h4>

              <p className="mx-auto mt-2 max-w-md text-xs font-medium leading-relaxed text-slate-500">
                No counselor accounts match
                the current search or filter.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-slate-200 bg-slate-100">
                  <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-3">
                      Counselor
                    </th>

                    <th className="px-4 py-3">
                      Specialty
                    </th>

                    <th className="px-4 py-3">
                      Office
                    </th>

                    <th className="px-4 py-3">
                      Capacity
                    </th>

                    <th className="px-4 py-3">
                      Availability
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredCounselors.map(
                    (counselor) => {
                      const capacity =
                        Number(
                          counselor.capacity
                        ) || 15

                      const isProcessing =
                        processingId ===
                        counselor.id

                      const disabled =
                        counselor.accountStatus ===
                        'disabled'

                      const available =
                        counselor.accountStatus ===
                          'active' &&
                        counselor.isAvailable !==
                          false

                      return (
                        <tr
                          key={counselor.id}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <FaUserMd />
                              </div>

                              <div>
                                <p className="text-xs font-extrabold text-slate-900">
                                  {counselor.name ||
                                    'Unnamed Counselor'}
                                </p>

                                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                  <FaEnvelope
                                    size={9}
                                  />

                                  {counselor.email ||
                                    'No email'}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <FaBriefcaseMedical className="text-primary" />

                              <span className="text-xs font-bold text-slate-700">
                                {counselor.specialty ||
                                  'General Counseling'}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs font-semibold text-slate-600">
                            {counselor.office ||
                              'Not assigned'}
                          </td>

                          <td className="px-4 py-4 text-xs font-bold text-slate-700">
                            {capacity} appointments
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                                available
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 bg-slate-100 text-slate-600'
                              }`}
                            >
                              {available
                                ? 'Available'
                                : 'Unavailable'}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={
                                counselor.accountStatus
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    counselor
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-extrabold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                              >
                                <FaEdit
                                  size={10}
                                />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openStatusConfirmation(
                                    counselor
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-extrabold disabled:opacity-50 ${
                                  disabled
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                }`}
                              >
                                {disabled ? (
                                  <>
                                    <FaCheckCircle
                                      size={10}
                                    />
                                    Restore
                                  </>
                                ) : (
                                  <>
                                    <FaBan
                                      size={10}
                                    />
                                    Disable
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openDeleteConfirmation(
                                    counselor
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-50"
                              >
                                <FaTrash
                                  size={10}
                                />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              resetAddModal()
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-poppins text-base font-extrabold text-slate-900">
                  Add New Counselor
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Create an active counselor
                  profile and login account.
                </p>
              </div>

              <button
                type="button"
                disabled={creating}
                onClick={resetAddModal}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>

            <form
              onSubmit={
                handleAddCounselor
              }
              className="mt-5 space-y-5"
            >
              {addError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                  {addError}
                </div>
              )}

              {addSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
                  {addSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  name="name"
                  value={addForm.name}
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="Dr Jane Smith"
                  required
                  disabled={creating}
                  className="sm:col-span-2"
                />

                <FormField
                  label="Email address"
                  name="email"
                  type="email"
                  value={addForm.email}
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="jane@mindconnect.com"
                  required
                  disabled={creating}
                />

                <FormField
                  label="Temporary password"
                  name="password"
                  type="password"
                  value={addForm.password}
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  disabled={creating}
                />

                <FormField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={addForm.phone}
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="+254 700 000 000"
                  disabled={creating}
                />

                <FormField
                  label="Specialty"
                  name="specialty"
                  value={
                    addForm.specialty
                  }
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="Clinical Psychology"
                  required
                  disabled={creating}
                />

                <FormField
                  label="Qualification"
                  name="qualification"
                  value={
                    addForm.qualification
                  }
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="MSc Clinical Psychology"
                  disabled={creating}
                />

                <FormField
                  label="Office"
                  name="office"
                  value={addForm.office}
                  onChange={
                    handleAddInputChange
                  }
                  placeholder="Room B204"
                  disabled={creating}
                />

                <FormField
                  label="Appointment capacity"
                  name="capacity"
                  type="number"
                  value={addForm.capacity}
                  onChange={
                    handleAddInputChange
                  }
                  min={1}
                  max={100}
                  disabled={creating}
                />

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      addForm.description
                    }
                    onChange={
                      handleAddInputChange
                    }
                    disabled={creating}
                    rows={4}
                    placeholder="Brief professional description..."
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-xs outline-none focus:border-primary disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-xs font-extrabold text-emerald-800">
                      Available immediately
                    </p>

                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-emerald-700">
                      New counselors are created
                      with an active status and are
                      automatically available for
                      student bookings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={creating}
                  onClick={resetAddModal}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/95 disabled:opacity-60"
                >
                  {creating && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {creating
                    ? 'Creating account...'
                    : 'Create Counselor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen &&
        selectedCounselor && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeEditModal()
              }
            }}
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-poppins text-base font-extrabold text-slate-900">
                    Edit Counselor
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Update profile details,
                    status and booking
                    availability.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={updating}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
                >
                  <FaTimesCircle
                    size={20}
                  />
                </button>
              </div>

              <form
                onSubmit={
                  handleUpdateCounselor
                }
                className="mt-5 space-y-5"
              >
                {editError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                    {editError}
                  </div>
                )}

                {editSuccess && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
                    {editSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Full name"
                    name="name"
                    value={editForm.name}
                    onChange={
                      handleEditInputChange
                    }
                    required
                    disabled={updating}
                    className="sm:col-span-2"
                  />

                  <FormField
                    label="Email address"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={() => {}}
                    disabled
                    helperText="Changing the Authentication email requires a trusted backend."
                  />

                  <FormField
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={
                      handleEditInputChange
                    }
                    disabled={updating}
                  />

                  <FormField
                    label="Specialty"
                    name="specialty"
                    value={
                      editForm.specialty
                    }
                    onChange={
                      handleEditInputChange
                    }
                    required
                    disabled={updating}
                  />

                  <FormField
                    label="Qualification"
                    name="qualification"
                    value={
                      editForm.qualification
                    }
                    onChange={
                      handleEditInputChange
                    }
                    disabled={updating}
                  />

                  <FormField
                    label="Office"
                    name="office"
                    value={editForm.office}
                    onChange={
                      handleEditInputChange
                    }
                    disabled={updating}
                  />

                  <FormField
                    label="Appointment capacity"
                    name="capacity"
                    type="number"
                    value={editForm.capacity}
                    onChange={
                      handleEditInputChange
                    }
                    min={1}
                    max={100}
                    disabled={updating}
                  />

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Account status
                    </label>

                    <select
                      name="accountStatus"
                      value={
                        editForm.accountStatus
                      }
                      onChange={
                        handleEditInputChange
                      }
                      disabled={updating}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold outline-none focus:border-primary disabled:bg-slate-100"
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="pending">
                        Pending
                      </option>

                      <option value="disabled">
                        Disabled
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        editForm.description
                      }
                      onChange={
                        handleEditInputChange
                      }
                      disabled={updating}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-xs outline-none focus:border-primary disabled:bg-slate-100"
                    />
                  </div>

                  <label className="flex items-center justify-between rounded-xl border border-slate-300 px-4 py-3 sm:col-span-2">
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">
                        Available for
                        appointments
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Allow students to
                        select this counselor.
                      </p>
                    </div>

                    <input
                      name="isAvailable"
                      type="checkbox"
                      checked={
                        editForm.isAvailable
                      }
                      onChange={
                        handleEditInputChange
                      }
                      disabled={
                        updating ||
                        editForm.accountStatus !==
                          'active'
                      }
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                </div>

                {editForm.accountStatus !==
                  'active' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-700">
                    Pending and disabled
                    counselors are automatically
                    unavailable for student
                    bookings.
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      closeEditModal
                    }
                    disabled={updating}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/95 disabled:opacity-60"
                  >
                    {updating && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}

                    {updating
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      <ConfirmationModal
        confirmation={confirmation}
        confirmationText={
          confirmationText
        }
        setConfirmationText={
          setConfirmationText
        }
        processing={Boolean(
          processingId
        )}
        onCancel={
          closeConfirmation
        }
        onConfirm={
          handleConfirmedAction
        }
      />
    </div>
  )
}