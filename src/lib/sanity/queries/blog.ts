import { groq } from 'next-sanity'

export const sanityImageWithAltFields = groq`
  alt,
  caption,
  attribution,
  image{
    asset->{
      _id,
      url,
      metadata{
        dimensions{
          width,
          height,
          aspectRatio
        },
        lqip
      }
    },
    crop,
    hotspot
  }
`

export const sanitySeoFields = groq`
  metaTitle,
  metaDescription,
  canonicalPath,
  noIndex,
  ogImage{
    ${sanityImageWithAltFields}
  }
`

export const sanityPortableTextBodyFields = groq`
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url,
        metadata{
          dimensions{
            width,
            height,
            aspectRatio
          },
          lqip
        }
      }
    },
    _type == "imageWithAlt" => {
      ...,
      image{
        asset->{
          _id,
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            },
            lqip
          }
        },
        crop,
        hotspot
      }
    },
    _type == "table" => {
      caption,
      rows[]{
        _key,
        cells[]{
          _key,
          text,
          alt,
          sourceUrl,
          image{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height,
                  aspectRatio
                },
                lqip
              }
            },
            crop,
            hotspot
          }
        }
      }
    }
  }
`

export const sanityBlogPostSummaryFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  featuredImage{
    ${sanityImageWithAltFields}
  },
  author->{name},
  categories[]->{title},
  tags,
  publishedAt,
  "bodyText": pt::text(body),
  seo{
    ${sanitySeoFields}
  }
`

/**
 * Lighter variant of sanityBlogPostSummaryFields for default listing use.
 * Omits bodyText (pt::text) to avoid fetching full article body on the unfiltered listing.
 * Reading-time falls back to excerpt length, which is acceptable for the listing view.
 * Tag/search paths must keep the full sanityBlogPostSummaryFields with bodyText.
 */
export const sanityBlogPostSummaryLightFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  featuredImage{
    ${sanityImageWithAltFields}
  },
  author->{name},
  categories[]->{title},
  tags,
  publishedAt,
  seo{
    ${sanitySeoFields}
  }
`

/**
 * Default listing query for the unfiltered /blogs/[handle] route.
 * Fetches blog metadata, featured posts, and the first page of latest non-featured articles.
 * Does NOT fetch bodyText — saves Sanity GROQ work for the common unfiltered case.
 * Provides totalCount of non-featured articles so pagination UI can be rendered correctly.
 *
 * The articles list excludes IDs that appear in the blog's featuredPosts references,
 * so the component receives a non-duplicated first-page result ready for display.
 */
export const defaultBlogListingQuery = groq`
  {
    "blog": *[_type == "blog" && slug.current == $blogHandle][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      heroImage{
        ${sanityImageWithAltFields}
      },
      seo{
        ${sanitySeoFields}
      },
      featuredPosts[]->{
        ${sanityBlogPostSummaryLightFields}
      }
    },
    "articles": *[
      _type == "blogPost" &&
      defined(slug.current) &&
      blog->slug.current == $blogHandle &&
      publishedAt <= now() &&
      !(_id in coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, []))
    ] | order(publishedAt desc)[$offset...$limit]{
      ${sanityBlogPostSummaryLightFields}
    },
    "totalCount": count(*[
      _type == "blogPost" &&
      defined(slug.current) &&
      blog->slug.current == $blogHandle &&
      publishedAt <= now() &&
      !(_id in coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, []))
    ]),
    "allTagArrays": *[
      _type == "blogPost" &&
      defined(slug.current) &&
      blog->slug.current == $blogHandle &&
      publishedAt <= now()
    ]{
      "categories": categories[]->.title,
      tags
    }
  }
`

export const blogListingQuery = groq`
  {
    "blog": *[_type == "blog" && slug.current == $blogHandle][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      heroImage{
        ${sanityImageWithAltFields}
      },
      seo{
        ${sanitySeoFields}
      },
      featuredPosts[]->{
        ${sanityBlogPostSummaryFields}
      }
    },
    "articles": *[
      _type == "blogPost" &&
      defined(slug.current) &&
      blog->slug.current == $blogHandle &&
      publishedAt <= now()
    ] | order(publishedAt desc){
      ${sanityBlogPostSummaryFields}
    }
  }
`

export const blogArticleQuery = groq`
  {
    "article": *[
      _type == "blogPost" &&
      slug.current == $articleHandle &&
      blog->slug.current == $blogHandle &&
      publishedAt <= now()
    ][0]{
      ${sanityBlogPostSummaryFields},
      _updatedAt,
      ${sanityPortableTextBodyFields},
      legacyComments[]{
        _key,
        id,
        authorName,
        contentHtml
      }
    }
  }
`

export const homepageBlogPostsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    blog->slug.current == $blogHandle &&
    publishedAt <= now()
  ] | order(publishedAt desc)[0...3]{
    ${sanityBlogPostSummaryFields}
  }
`
