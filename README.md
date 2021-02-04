# ocw-course-hugo-theme

This is a Hugo theme for rendering an OCW course.  It is implemented as a Hugo Module and can be utilized following the instructions [here](https://gohugo.io/hugo-modules/use-modules/#use-a-module-for-a-theme).  An example implementation can be found [here](https://github.com/mitodl/ocw-course-hugo-starter).  Existing course data is provided by [`ocw-to-hugo`](https://github.com/mitodl/ocw-to-hugo), or you can provide your own markdown & course metadata.

## running locally with docker

This project includes a Docker configuration for local development in the `docker` folder.  An example environment file can be found at `docker/example.env`.  These variables only need to be set if you are sourcing existing OCW content using `ocw-to-hugo`, otherwise you should place your content in the `docker/hugo/content` folder and your course data template at `docker/hugo/data/course.json`.  Here is a description of the variables that are used:

| key | type | required? | description |
| --- | --- | --- | --- |
| `OCW_TEST_COURSE` | string | Yes | The course ID of the OCW course you are trying to work with, i.e. `1-124j-foundations-of-software-engineering-fall-2000` |
| `OCW_TO_HUGO_PATH` | string | No | The path to your locally checked out `ocw-to-hugo` repo |
| `OCW_TO_HUGO_DOWNLOAD` | boolean | No | A boolean value that determines whether or not course data is downloaded from AWS |
| `OCW_TO_HUGO_INPUT` | string | Only if `OCW_TO_HUGO_DOWNLOAD` is false | An override for the `-i` flag in `ocw-to-hugo`, used if you already have course data downloaded locally that you want to use.  Note that this path is used inside the docker container, so if you want a path relative to your local `ocw-to-hugo`, that is mounted inside the container at `/ocw-to-hugo`. |
| `AWS_BUCKET_NAME` | string | Only if `OCW_TO_HUGO_DOWNLOAD` is true | The AWS bucket to download course data from, i.e. `open-learning-course-data-production` |
| `AWS_REGION` | string | Only if `OCW_TO_HUGO_DOWNLOAD` is true | The AWS region to connect to |
| `AWS_ACCESS_KEY_ID` | string | Only if `OCW_TO_HUGO_DOWNLOAD` is true | The AWS access key ID to use |
| `AWS_SECRET_ACCESS_KEY` | string | Only if `OCW_TO_HUGO_DOWNLOAD` is true | The AWS secret access key to use |


Once you have the environment configured to your liking, run the following to build the docker image and start it up:

```
cd docker
docker-compose up --build
```

## building dependencies

If you are implementing this theme in your own custom Hugo site, you will need to install some dependencies.  To build this theme's dependencies, run the following in the theme directory:

```sh
yarn install
npm run build
```

In order to use the PDF Viewer layout, the generic [pdfjs](https://mozilla.github.io/pdf.js/) viewer needs to be built and deposited into the `static` folder.  This needs to be done by pulling the PDFJS [source](https://github.com/mozilla/pdf.js/) and running the following commands from the pdfjs source directory:

```sh
npm install
gulp generic
```

You can then copy the build artifacts into the proper location within your project's theme folder like so:

```sh
# copy artifacts where they belong
mkdir -p static/pdfjs
cp -r $PDFJS_PATH/build/generic/* $THEME_PATH/static/pdfjs
cp -r $THEME_PATH/dist/* $THEME_PATH/static
```

`PDFJS_PATH` is the path to the extracted pdfjs source, and `THEME_PATH` is the path to this repository

##  course data template

Course level metadata is stored in a `course.json` file in the `data` directory.

| key | example value | description |
| --- | --- | --- |
| `course_id` | `"1-124j-foundations-of-software-engineering-fall-2000"` | In legacy OCW, this property is referred to as `short_url` and serves as a unique identifier for a course |
| `course_title` | `"Foundations of Software Engineering"` | The verbose title of the course |
| `course_image_url` | `"https://url/to/course_image.jpg"` | URL to the full size course image |
| `course_thumbnail_image_url` | `"https://url/to/course_thumbnail_image.jpg"` | URL to the thumbnail size course image |
| `course_image_alternate_text` | `"A close-up photo of text on a computer screen"` | The alt text for the course image |
| `course_image_caption_text` | `"\n<p>Computer screen. (Photo courtesy of <a href=\"http://www.openphoto.net.\">openphoto.net.</a>)</p>"` | The caption text for the course image |
| `publishdate` | `"2004-03-25T03:03:39-05:00"` | The date the course was published |
| `instructors` | `["Prof. Kevin Amaratunga"]` | A list of instructors that contributed to this course |
| `departments` | `["Civil and Environmental Engineering", "Mechanical Engineering"]` | A list of departments this course belongs to |
| `course_features` | `[{"feature": "Exams", "subfeature": "Solutions"}, {"feature": "Assignments","subfeature": "written (no examples)"}]` | A list of `course_feature` objects, each containing a `feature` and possibly a `subfeature` |
| `topics` | `[{"topic": "Engineering", "subtopics": [{"subtopic": "Computer Science", "specialities": ["Software Design and Engineering"]}]}]` | A list of `topic` objects with optionally nested `subtopics` and `specialities` |
| `course_numbers` | `["1.124J", "2.159J"]` | A list of the course numbers used for this course |
| `term` | `"Fall 2000"` | The term this course was originally taught in |
| `level` | `"Graduate"` | The level (graduate, undergraduate) at which this course was originally taught |

## layouts

In Hugo sites, content is written as markdown files into the `content` directory.  At the top of these files, in between lines of `---`, YAML data called "front matter" is passed into the page at render time for extra context.  This site uses the Hugo `type` and `layout` front matter parameters to tell Hugo which template it should use to render a given page.  The following types / layouts are available for use:

### type: course

The `course` type contains various top level layouts for rendering course pages.  These are pages with the `type` front matter parameter set to `course`.  Every `course` type page also has a `course_id` set on it.  In our example above, this is `1-124j-foundations-of-software-engineering-fall-2000`

#### layout: course_home

The `course_home` layout renders the course image / caption, description and various other pieces metadata.

#### layout: course_section

The `course_section` layout is used for rendering all other course sections aside from PDF, videogallery and video sections.

#### layout: pdf

The `pdf` layout takes the `file_location` front matter value and renders an inline PDF viewer using [pdfjs](https://mozilla.github.io/pdf.js/) along with a download button to download said PDF.

#### layout: videogallery

Pages with the `videogallery` layout iterate other pages at the same tier as it with the `video` layout and render cards for the pages it finds with links to each video page.

#### layout: video

These pages render the `youtube_player.html` partial.  It scans the `embedded_media` front matter key of the page passed in and looks for entries with the `title` property of `Video-YouTube-Stream`.  It then takes the first entry and renders an iframe YouTube player with the video it found.
