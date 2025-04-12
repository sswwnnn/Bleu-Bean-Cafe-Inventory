import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const EditModal = ({
  isOpen,
  onClose,
  title,
  icon = "bi-pencil-square",
  onSave,
  isSaving = false,
  children
}) => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has edit permissions
  const canEdit = user?.role === "admin" || user?.role === "staff"

  const handleSave = async () => {
    if (!canEdit) return

    setIsSubmitting(true)
    try {
      await onSave()
      onClose()
    } catch (error) {
      console.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-[#6B4226]">
            <i className={`${icon} me-2`}></i> {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">{children}</div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canEdit || isSubmitting || isSaving}
          >
            {isSubmitting || isSaving ? (
              <>
                <i className="bi bi-hourglass me-1"></i> Saving...
              </>
            ) : (
              <>
                <i className="bi bi-save me-1"></i> Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditModal

