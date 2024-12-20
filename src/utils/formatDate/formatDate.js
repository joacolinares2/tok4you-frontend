export const formatDate = ( isoString ) => {
    const date = new Date( isoString );

    // Get the components of the date
    const year = date.getUTCFullYear();
    const month = String( date.getUTCMonth() + 1 ).padStart( 2, '0' ); // Months are zero-based
    const day = String( date.getUTCDate() ).padStart( 2, '0' );
    const hours = String( date.getUTCHours() ).padStart( 2, '0' );
    const minutes = String( date.getUTCMinutes() ).padStart( 2, '0' );

    // Format the date string
    return `${year}-${month}-${day} ${hours}:${minutes} UTC-3`; // Adjust the timezone as needed
};
