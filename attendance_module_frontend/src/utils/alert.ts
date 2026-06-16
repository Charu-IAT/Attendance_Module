import Swal from 'sweetalert2';

/**
 * Displays a premium custom confirmation dialog.
 * @param title - The title of the alert
 * @param text - The description/body text
 * @returns Promise resolving to SweetAlert2 result
 */
export const confirmDelete = async (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ef4444', // Red delete color (matching toast/error)
    cancelButtonColor: '#6b7280',  // Grey neutral color
    background: '#ffffff',
    iconColor: '#f59e0b',          // Amber warning color
    customClass: {
      popup: 'swal-premium-popup',
      title: 'swal-premium-title',
      htmlContainer: 'swal-premium-text',
      confirmButton: 'swal-premium-confirm-btn',
      cancelButton: 'swal-premium-cancel-btn',
    },
    buttonsStyling: true,
  });
};

/**
 * Displays a premium custom logout confirmation dialog.
 * @returns Promise resolving to SweetAlert2 result
 */
export const confirmLogout = async () => {
  return Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to log out?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, log out',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#f97316', // Orange confirmation color
    cancelButtonColor: '#6b7280',  // Grey neutral color
    background: '#ffffff',
    iconColor: '#f97316',          // Orange question icon color
    customClass: {
      popup: 'swal-premium-popup',
      title: 'swal-premium-title',
      htmlContainer: 'swal-premium-text',
      confirmButton: 'swal-premium-confirm-btn',
      cancelButton: 'swal-premium-cancel-btn',
    },
    buttonsStyling: true,
  });
};
