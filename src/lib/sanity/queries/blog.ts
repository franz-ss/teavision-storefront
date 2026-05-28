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
      },
      legacy{
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
