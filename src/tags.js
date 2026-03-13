function buildTags(tag, index) {

    const tagsList = document.createElement('div');
        tagsList.className = 'tag-div';
        
    const tagLi = document.createElement('li');
        tagLi.textContent = tag.name;
        tagLi.innerHTML = `<span>${tag.name}</span>`;
        tagLi.className = 'tag-name';
        tagLi.setAttribute('data-index', index);
        tagLi.setAttribute('data-id', tag.id);
            tagsList.append(tagLi);

    const closeTag = document.createElement('div');
        closeTag.className = 'close-tag';
        closeTag.setAttribute('data-index', index);
        closeTag.setAttribute('data-id', tag.id);
            tagsList.appendChild(closeTag);

    return tagsList;
};

export { buildTags };