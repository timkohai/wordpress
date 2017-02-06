<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * @package WordPress
 * @subpackage Plum Market
 * @since Plum Market 1.0
 */

get_header(); ?>

	<div class="container-main">
	    <div class="main-content container">
	        <!-- Stellar start -->
			<?php
			// Start the loop.
			while ( have_posts() ) : the_post();

				// Include the page content template.
				the_content( sprintf(
					__( 'Continue reading %s', 'twentyfifteen' ),
					the_title( '<span class="screen-reader-text">', '</span>', false )
				) );

			// End the loop.
			endwhile;
			?>
	        <!-- Stellar End -->
	    </div>
	</div>

<?php get_footer(); ?>
