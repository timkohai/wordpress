<?php
/**
 * The default template for displaying content
 *
 * Used for both single and index/archive/search.
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */
?>



<?php

	/* translators: %s: Name of current post */
	the_content( sprintf(
		__( 'Continue reading %s', 'twentyfifteen' ),
		the_title( '<span class="screen-reader-text">', '</span>', false )
	) );

?>
